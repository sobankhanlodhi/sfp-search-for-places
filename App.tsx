import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from './src/screens/WelcomeScreen'
import AppNavigator from './src/navigation/AppNavigator'
import { storage } from './src/utils/storage'
import MapDetailScreen from './src/screens/MapDetailScreen'

const Stack = createNativeStackNavigator()

const App: React.FC = () => {
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean | null>(null)

  useEffect(() => {
    const savedPermission: boolean | undefined = storage.getBoolean('locationPermissionGranted')
    setLocationPermissionGranted(savedPermission === true)
  }, [])

  if (locationPermissionGranted === null) {
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {locationPermissionGranted ? (
          <>
            <Stack.Screen name="AppNavigator" component={AppNavigator} />
            <Stack.Screen name="MapDetail" component={MapDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="AppNavigator" component={AppNavigator} />
            <Stack.Screen name="MapDetail" component={MapDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
