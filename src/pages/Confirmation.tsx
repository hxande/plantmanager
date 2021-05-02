import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

import { Button } from '../components/Button';

import colors from '../styles/colors';

interface Params {
    title: string;
    subtitle: string;
    buttonTitle: string;
    icon: string;
    nextScreen: string;
}

export function Confirmation() {
    const navigation = useNavigation();
    const routes = useRoute();

    const {
        title,
        subtitle,
        buttonTitle,
        icon,
        nextScreen,
    } = routes.params as Params;

    function handleMoveOn() {
        navigation.navigate(nextScreen);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>
                    {icon}
                </Text>
                <Text style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>
                <View style={styles.footer}>
                    <Button
                        title={buttonTitle}
                        onPress={handleMoveOn}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 30
    },

    emoji: {
        fontSize: 32,
    },

    title: {
        fontSize: 22,
        lineHeight: 38,
        textAlign: 'center',
        color: colors.heading,
        marginTop: 15,
    },

    subtitle: {
        textAlign: 'center',
        fontSize: 17,
        color: colors.heading,
        paddingVertical: 10,
    },

    footer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 50,
    }
});