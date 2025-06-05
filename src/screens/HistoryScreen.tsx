import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { storage } from '../utils/storage';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

interface HistoryItem {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    placeId: string; 
    timestamp: string;
    phoneNumber?: string;
    website?: string;
    rating?: number;
    userRatingsTotal?: number;
}

type RootStackParamList = {
    AppNavigator: undefined; 
    MapDetail: { placeId: string; placeName: string }; 
};
type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppNavigator'>; 

const HistoryScreen = () => {
    const navigation = useNavigation<HistoryScreenNavigationProp>();
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const loadHistory = useCallback(() => {
        try {
            const storedHistoryString = storage.getString('searchHistory');
            if (storedHistoryString) {
                setHistory(JSON.parse(storedHistoryString));
            } else {
                setHistory([]);
            }
        } catch (e) {
            console.error(STRINGS.FAILED_TO_LOAD_HISTORY, e);
            setHistory([]);
        }
    }, []); 

    
    useFocusEffect(
        useCallback(() => {
            loadHistory();
            return () => {}
        }, [loadHistory])
    );

    const handleHistoryItemPress = (item: HistoryItem) => {
        navigation.navigate('MapDetail', { placeId: item.placeId, placeName: item.name });
    };

    const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
        <TouchableOpacity style={styles.historyItem} onPress={() => handleHistoryItemPress(item)}>
            <Text style={styles.historyItemName}>{item.name}</Text>
            <Text style={styles.historyItemAddress}>{item.address}</Text>
            <Text style={styles.historyItemTimestamp}>
                {new Date(item.timestamp).toLocaleString()}
            </Text>
        </TouchableOpacity>
    );

    const clearSearchHistory = () => {
        Alert.alert(
            STRINGS.CLEAR_HISTORY,
            STRINGS.CLEAR_HISTORY_MESSAGE,
            [
                {
                    text: STRINGS.CANCEL,
                    style: "cancel",
                },
                {
                    text: STRINGS.CLEAR,
                    onPress: () => {
                        try {
                            storage.delete('searchHistory'); 
                            setHistory([]); 
                        } catch (e) {
                            console.error(STRINGS.FAILED_TO_CLEAR_HISTORY, e);
                            Alert.alert("Error", "Could not clear history. Please try again.");
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>History</Text>
            {history.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={clearSearchHistory}>
                    <Text style={styles.clearButtonText}>Clear History</Text>
                </TouchableOpacity>
            )}
            {history.length === 0 ? (
                <Text style={styles.noHistoryText}>No search history yet.</Text>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item, index) => item.placeId + item.timestamp + index} 
                    renderItem={renderHistoryItem}
                    contentContainerStyle={styles.historyListContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.customBlack,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 100,
        marginBottom: 20,
    },
    clearButton: {
        backgroundColor: COLORS.littleDarker, 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 15, 
        borderWidth: 1,
        borderColor: COLORS.seperatorBorderColor,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noHistoryText: {
        color: COLORS.addressTextColor,
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    historyListContent: {
        paddingHorizontal: 15,
        paddingBottom: 20, 
    },
    historyItem: {
        backgroundColor: '#282828',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.seperatorBorderColor,
    },
    historyItemName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    historyItemAddress: {
        color: COLORS.addressTextColor,
        fontSize: 14,
        marginBottom: 5,
    },
    historyItemTimestamp: {
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
    },
});

export default HistoryScreen;