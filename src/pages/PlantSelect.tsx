import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Header } from '../components/Header';
import { EnviromentButton } from '../components/EnviromentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Loading } from '../components/Loading';
import api from '../services/api';

import colors from '../styles/colors';
import { Plants } from '../libs/storage';

interface Enviroments {
    key: string;
    title: string;
}

export function PlantSelect() {
    const navigation = useNavigation();

    const [enviroments, setEnviroments] = useState<Enviroments[]>();
    const [plants, setPlants] = useState<Plants[]>();
    const [filteredPlants, setFilteredPlants] = useState<Plants[]>();
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(true);

    useEffect(() => {
        async function fetchEnviroment() {
            const { data } = await api.get('/plants_environments?_sort=title&_order=asc');
            setEnviroments([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ]);
        }

        fetchEnviroment();
    }, []);

    useEffect(() => {
        fetchPlants();
    }, []);

    function handleEnviromentSelected(enviroment: string) {
        setEnviromentSelected(enviroment);

        if (enviroment === 'all') {
            return setFilteredPlants(plants);
        } else {
            const filtered = plants!.filter(plant => {
                return plant.environments.includes(enviroment);
            });
            setFilteredPlants(filtered);
        }
    }

    async function fetchPlants() {
        const { data } = await api.get(`/plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if (!data) {
            return setLoading(true);
        }

        if (page > 1) {
            setPlants(oldValue => [...oldValue!, ...data]);
            setFilteredPlants(oldValue => [...oldValue!, ...data]);
        } else {
            setPlants(data);
            setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1) {
            return;
        }

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    function handlePlantSelect(plant: Plants) {
        navigation.navigate('PlantSave', { plant });
    }

    if (loading) {
        return <Loading />
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={[styles.title, { marginTop: 20 }]}>
                    Em qual ambiente
                </Text>
                <Text style={styles.title}>
                    você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList
                    data={enviroments}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                            data={item}
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    contentContainerStyle={styles.plantList}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => {
                        handleFetchMore(distanceFromEnd);
                    }}
                    ListFooterComponent={
                        loadingMore
                            ? <ActivityIndicator color={colors.green} />
                            : <></>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        paddingHorizontal: 25,
    },

    title: {
        fontSize: 17,
        color: colors.heading,
        lineHeight: 20,
    },

    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
    },

    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    },

    plantList: {
    }
});