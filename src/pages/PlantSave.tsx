import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { format, isBefore } from 'date-fns';

import { Button } from '../components/Button';
import { Plants, savePlant } from '../libs/storage';

import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';

interface Params {
    plant: Plants;
}

export function PlantSave() {
    const route = useRoute();
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

    function handleChangeTime(event: Event, dateTime: Date | undefined) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro!');
        }

        if (dateTime) {
            setSelectedDateTime(dateTime);
        }
    }

    function handleOpenDateTimePickerAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave() {
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime,
            });

            navigation.navigate('Confirmation', {
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
                buttonTitle: 'Muito Obrigado',
                icon: '=D',
                nextScreen: 'MyPlants'
            });
        } catch (error) {
            return Alert.alert('Não foi possível salvar.');
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri uri={plant.photo} width={100} height={100} />
                    <Text style={styles.plantName}> {plant.name}</Text>
                    <Text style={styles.plantAbout}> {plant.about}</Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>{plant.water_tips}</Text>
                    </View>
                    <Text style={styles.alertLabel}>Escolha o melhor horário para ser lembrado:</Text>

                    <DateTimePicker
                        style={{ height: 100 }}
                        value={selectedDateTime}
                        mode='time'
                        display='spinner'
                        onChange={handleChangeTime}
                    />

                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity style={styles.dateTimePickerButton} onPress={handleOpenDateTimePickerAndroid}>
                                <Text style={styles.dateTimePickerText}>
                                    {`Mudar ${format(selectedDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    <Button
                        title='Cadastrar planta'
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape,
    },

    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape,

    },

    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20,
    },

    plantName: {
        color: colors.heading,
        fontSize: 24,
        marginTop: 15,
    },

    plantAbout: {
        textAlign: 'center',
        color: colors.heading,
        fontSize: 17,
        marginTop: 10,
    },

    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60,
    },

    tipImage: {
        width: 56,
        height: 56,
    },

    tipText: {
        flex: 1,
        marginLeft: 20,
        fontSize: 17,
        color: colors.blue,
        marginTop: 10,
        textAlign: 'justify',
    },

    alertLabel: {
        fontSize: 12,
        color: colors.heading,
        marginBottom: 5,
        textAlign: 'center',
    },

    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },

    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
    }
});