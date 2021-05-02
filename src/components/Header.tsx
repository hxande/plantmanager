import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import colors from '../styles/colors';

export function Header() {

    const [userName, setUserName] = useState<string>();

    useEffect(() => {
        async function loadStorageUsername() {
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');
        }

        loadStorageUsername();
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greetings}>Olá,</Text>
                <Text style={styles.userName}>{userName}</Text>
            </View>
            <Image source={{}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getStatusBarHeight(),
    },

    greetings: {
        fontSize: 32,
        color: colors.heading,
    },

    userName: {
        fontSize: 32,
        color: colors.heading,
        lineHeight: 40,
    },

    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
    }
});