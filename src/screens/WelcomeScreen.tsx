import React from 'react'
import { View, Text, Button, Alert, StyleSheet, Platform, TouchableOpacity, Linking } from 'react-native'
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { storage } from '../utils/storage'
import { COLORS } from '../constants/colors'
import { STRINGS } from '../constants/strings'
import { FONT_FAMILY } from '../constants/fonts'

type RootStackParamList = {
    Welcome: undefined
    AppNavigator: undefined
}

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>

const WelcomeScreen: React.FC = () => {
    const navigation: WelcomeScreenNavigationProp = useNavigation<WelcomeScreenNavigationProp>()

    const handleGetStarted = async (): Promise<void> => {
        const locationPermissionType = Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

        let currentStatus = await check(locationPermissionType)
        if (currentStatus === RESULTS.GRANTED) {
            storage.set('locationPermissionGranted', true)
            navigation.replace('AppNavigator')
            return
        }
        if (currentStatus === RESULTS.DENIED) {
            let requestResult = await request(locationPermissionType)

            if (requestResult === RESULTS.GRANTED) {
                storage.set('locationPermissionGranted', true)
                navigation.replace('AppNavigator')
            } else {
                Alert.alert(
                    'Location Permission Required',
                    'Location permission is required to access app features. Please allow it when prompted or enable it in your device settings.',
                    [{ text: 'OK' }],
                )
            }
            return
        }
        if (currentStatus === RESULTS.BLOCKED || currentStatus === RESULTS.UNAVAILABLE) {
           
            Alert.alert(
                'Location Permission Required',
                'Location permission is permanently denied or unavailable. Please enable it from your app settings to use all features.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ],
            )
            return
        }
        if (currentStatus === RESULTS.LIMITED) {
            let requestResult = await request(locationPermissionType)

            if (requestResult === RESULTS.GRANTED) {
                storage.set('locationPermissionGranted', true)
                navigation.replace('AppNavigator')
            } else if (requestResult === RESULTS.BLOCKED || requestResult === RESULTS.UNAVAILABLE) {
                Alert.alert(
                    'Location Permission Required',
                    'Location permission is permanently denied or unavailable. Please enable it from your app settings to use all features.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ],
                )
            } else {
                Alert.alert(
                    'Location Permission Required',
                    'Location permission is required to access app features. Please allow it when prompted or enable it in your device settings.',
                    [{ text: 'OK' }],
                )
            }
            return
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{STRINGS.WELCOME}</Text>
            <Text style={styles.subTitle}>Search for Places</Text>
            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                <Text style={styles.getStartedButtonText}>{STRINGS.GET_STARTED}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: FONT_FAMILY.semiBold
    },
    subTitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: FONT_FAMILY.regular
    },
    getStartedButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
        shadowColor: COLORS.pureBlack,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    getStartedButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY.regular
    },
})

export default WelcomeScreen