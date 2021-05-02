import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Alert } from 'react-native';
import { formatDistance } from 'date-fns';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { loadPlant, Plants, removePlant } from '../libs/storage';
import colors from '../styles/colors';

import waterdrop from '../assets/waterdrop.png';
import { ptBR } from 'date-fns/locale';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<Plants[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await loadPlant();
            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: ptBR }
            );

            setMyPlants(plantsStoraged);
            setNextWatered(`Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`);
            setLoading(false);
        }

        loadStorageData();
    }, []);

    function handleRemove(plant: Plants) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) => (
                            oldData.filter((item) => item.id !== plant.id)
                        ));
                    } catch (error) {
                        Alert.alert('Não foi possível remover!');
                    }
                }
            }

        ]);
    }

    if (loading) {
        return <Loading />
    }

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.spotlight}>
                <Image
                    style={styles.spotlightImage}
                    source={waterdrop}
                />
                <Text style={styles.spotlightText}>
                    {nextWatered}
                </Text>
            </View>
            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary data={item} handleRemove={() => { handleRemove(item) }} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background,
    },

    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    spotlightImage: {
        width: 60,
        height: 60,
    },

    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },

    plants: {
        flex: 1,
        width: '100%',
    },

    plantsTitle: {
        fontSize: 24,
        color: colors.heading,
        marginVertical: 20,
    }
});