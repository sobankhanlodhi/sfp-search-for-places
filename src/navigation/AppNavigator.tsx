import React from 'react'
import { Image, ImageStyle, Platform, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import HistoryScreen from '../screens/HistoryScreen'
import { APP_ICONS } from '../constants/icons'
import { COLORS } from '../constants/colors'

const Tab = createBottomTabNavigator()

const AppNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color }) => {
                    let iconSource
                    if (route.name === 'Home') {
                        iconSource = APP_ICONS.IC_HOME
                    } else if (route.name === 'History') {
                        iconSource = APP_ICONS.IC_HISTORY
                    }
                    return (
                        <Image
                            source={iconSource}
                            style={[styles.bottomTabIcons, { tintColor: color }]}
                        />
                    )
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: COLORS.customBlack, 
                    borderTopWidth: 0, 
                    height: Platform.OS === 'ios' ? 90 : 60, 
                    paddingBottom: Platform.OS === 'ios' ? 30 : 0, 
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
                tabBarItemStyle: {
                    borderRightWidth: 0.5, 
                    borderRightColor: COLORS.seperatorBorderColor,
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
    )
}

export default AppNavigator

const styles = StyleSheet.create<{
    bottomTabIcons: ImageStyle
}>({
    bottomTabIcons: {
        width: 25,
        height: 25,
        tintColor: 'red'
    }
})
