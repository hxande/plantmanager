import React from 'react';
import { SafeAreaView, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Feather } from '@expo/vector-icons';

import wateringImg from '../assets/watering.png';
import colors from '../styles/colors';

export function Welcome() {
    const navigation = useNavigation();

    function handleStart() {
        navigation.navigate('UserIdentification');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Gerencie {'\n'}
                suas plantas {'\n'}
                de forma fácil
            </Text>
            <Image source={wateringImg} style={styles.image} resizeMode='contain' />
            <Text style={styles.subtitle}>
                Não esqueça mais de regar suas plantas. Nós cuidamos de lembrar você sempre que precisar.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleStart}>
                <Text style={styles.buttonIcon}>
                    <Feather name='chevron-right' style={styles.buttonIcon} />
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.heading,
        marginTop: 38,
    },

    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 20,
        color: colors.heading,
    },

    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width: 56,
    },

    image: {
        height: Dimensions.get('window').width * 0.7,
    },

    buttonIcon: {
        fontSize: 32,
        color: colors.white
    }
});