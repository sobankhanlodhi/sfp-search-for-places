import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; 
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { storage } from '../utils/storage'; 
import { APP_ICONS } from '../constants/icons';
import { GOOGLE_API_KEY } from '../constants/key';
import { COLORS } from '../constants/colors';

type RootStackParamList = {
    AppNavigator: undefined; 
    MapDetail: { placeId: string; placeName: string }; 
};

type MapDetailScreenRouteProp = RouteProp<RootStackParamList, 'MapDetail'>;
type MapDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppNavigator'>; 

interface PlaceDetails {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber?: string;
    website?: string;
    rating?: number;
    userRatingsTotal?: number;
}

interface HistoryItem extends PlaceDetails {
    timestamp: string;
    placeId: string
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0022; 
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapDetailScreen = () => {
    const route = useRoute<MapDetailScreenRouteProp>();
    const navigation = useNavigation<MapDetailScreenNavigationProp>();
    const { placeId, placeName } = route.params;

    const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaceDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,formattedAddress,location,internationalPhoneNumber,websiteUri,rating,userRatingCount&key=${GOOGLE_API_KEY}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': GOOGLE_API_KEY,
                    },
                }
            );

            const data = await response.json();
            console.log('Place Details API Response:', JSON.stringify(data, null, 2));

            if (response.ok && data.displayName && data.location) {
                const details: PlaceDetails = {
                    name: data.displayName.text,
                    address: data.formattedAddress,
                    latitude: data.location.latitude,
                    longitude: data.location.longitude,
                    phoneNumber: data.internationalPhoneNumber,
                    website: data.websiteUri,
                    rating: data.rating,
                    userRatingsTotal: data.userRatingCount,
                };
                setPlaceDetails(details);
                saveToHistory(details); 
            } else {
                setError(data.error?.message || 'Failed to fetch place details.');
            }
        } catch (err) {
            console.error('Fetch place details error:', err);
            setError('Network error or API issue while fetching details.');
        } finally {
            setLoading(false);
        }
    };

    const saveToHistory = (details: PlaceDetails) => {
        try {
            const currentHistoryString = storage.getString('searchHistory');
            const currentHistory: HistoryItem[] = currentHistoryString
                ? JSON.parse(currentHistoryString)
                : [];

            const newItem: HistoryItem = {
                ...details,
                timestamp: new Date().toISOString(), 
                placeId: route.params.placeId
            };

            if (currentHistory.length > 0 && currentHistory[0].name === details.name) {

            } else {
                
                const updatedHistory = [newItem, ...currentHistory];
                
                if (updatedHistory.length > 50) { 
                    updatedHistory.pop();
                }
                storage.set('searchHistory', JSON.stringify(updatedHistory));
            }
        } catch (e) {
            console.error('Failed to save history:', e);
        }
    };


    useEffect(() => {
        fetchPlaceDetails();
    }, [placeId]); 

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading place details...</Text>
            </View>
        );
    }

    if (error || !placeDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Could not load place details.'}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    {APP_ICONS.IC_ARROW_BACK ? (
                        <Image style={{ width: 24, height: 24 }} source={APP_ICONS.IC_ARROW_BACK} />
                    ) : (
                        <Text style={styles.backButtonText}>Go Back</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                {APP_ICONS.IC_ARROW_BACK ? (
                    <Image style={{ width: 24, height: 24 }} source={APP_ICONS.IC_ARROW_BACK} />
                ) : (
                    <Text style={styles.backButtonText}>Back</Text>
                )}
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.placeName}>{placeDetails.name}</Text>
                <Text style={styles.placeAddress}>{placeDetails.address}</Text>

                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE} 
                        style={styles.map}
                        initialRegion={{
                            latitude: placeDetails.latitude,
                            longitude: placeDetails.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        region={{ 
                            latitude: placeDetails.latitude,
                            longitude: placeDetails.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        showsUserLocation={false} 
                        zoomEnabled={true}
                        scrollEnabled={true}
                    >
                        <Marker
                            coordinate={{
                                latitude: placeDetails.latitude,
                                longitude: placeDetails.longitude,
                            }}
                            title={placeDetails.name}
                            description={placeDetails.address}
                        />
                    </MapView>
                </View>

                {!!(placeDetails.phoneNumber || placeDetails.website || placeDetails.rating) && (
                    <View style={styles.detailsCard}>
                        {placeDetails.phoneNumber && (
                            <Text style={styles.detailText}>Phone: {placeDetails.phoneNumber}</Text>
                        )}
                        {placeDetails.website && (
                            <Text style={styles.detailText}>Website: {placeDetails.website}</Text>
                        )}
                        {placeDetails.rating && (
                            <Text style={styles.detailText}>Rating: {placeDetails.rating} ({placeDetails.userRatingsTotal || 0} reviews)</Text>
                        )}
                    </View>
                )
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.customBlack,
        paddingTop: Platform.OS === 'android' ? 25 : 0, 
    },
    backButton: {
        padding: 10,
        position: 'absolute', 
        top: Platform.OS === 'android' ? 25 : 50,
        left: 10,
        zIndex: 10, 
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
    },
    scrollContent: {
        flexGrow: 1, 
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 80, 
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.customBlack,
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.customBlack,
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    placeName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
    },
    placeAddress: {
        fontSize: 16,
        color: COLORS.addressTextColor,
        marginBottom: 20,
        textAlign: 'center',
    },
    mapContainer: {
        width: width - 40, 
        height: height * 0.4, 
        borderRadius: 10,
        overflow: 'hidden', 
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.seperatorBorderColor,
    },
    map: {
        ...StyleSheet.absoluteFillObject, 
    },
    detailsCard: {
        width: '100%',
        backgroundColor: '#282828',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.seperatorBorderColor,
    },
    detailText: {
        color: 'white',
        fontSize: 15,
        marginBottom: 5,
    },
});

export default MapDetailScreen;