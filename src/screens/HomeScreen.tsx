import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard,
    Alert,
    Platform,
    Image,
} from 'react-native';
import { debounce } from '../utils/debounce';
import { COLORS } from '../constants/colors';
import { APP_ICONS } from '../constants/icons';
import { GOOGLE_API_KEY } from '../constants/key';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    AppNavigator: undefined; 
    MapDetail: { placeId: string; placeName: string }; 
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppNavigator'>;

interface PlaceSuggestion {
    placePrediction: {
        placeId: string;
        structuredFormat: {
            mainText: {
                text: string
            },
            secondaryText: {
                text: string
            }
        },
        text: {
            text: string
        }
    }

}

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>(); 
    const [searchText, setSearchText] = useState<string>('');
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaceSuggestions = async (input: string) => {
        if (!input.trim()) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);


        try {
            const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_API_KEY
                },
                body: JSON.stringify({ input }),
            });

            const data = await response.json();
            if (response.status === 200) {
                setSuggestions(data.suggestions);
            } else if (response.status === 400) {
                setSuggestions([]);
                setError(`Error fetching suggestions: ${data.error.message || response.status}`);
            } else if (response.status === 500) {
                setSuggestions([]);
                setError('Internal Server Error');
            } else {
                setSuggestions([]);
                setError(`Error fetching suggestions: ${data.error.message || response.status}`);
            }
        } catch (err) {
            console.error('API call error:', err);
            setError('Network error or API issue. Please try again.');
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchSuggestions = useCallback(
        debounce(fetchPlaceSuggestions, 500),
        []
    );

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedFetchSuggestions(searchText);
        } else {
            setSuggestions([]);
            setLoading(false);
            setError(null);
        }
    }, [searchText, debouncedFetchSuggestions]);

    const handleSuggestionPress = (suggestion: PlaceSuggestion) => {
        setSearchText(suggestion.placePrediction.structuredFormat?.mainText.text);
        setSuggestions([])
        Keyboard.dismiss()
        navigation.navigate('MapDetail', {
            placeId: suggestion.placePrediction.placeId,
            placeName: suggestion.placePrediction.structuredFormat?.mainText.text, 
        });
    };

    const renderSuggestionItem = ({ item }: { item: PlaceSuggestion }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSuggestionPress(item)}
        >
            <Text style={styles.suggestionMainText}>
                {item?.placePrediction?.structuredFormat?.mainText?.text || item?.placePrediction?.text?.text}
            </Text>
            {item?.placePrediction?.structuredFormat?.secondaryText?.text && (
                <Text style={styles.suggestionSecondaryText}>
                    {item?.placePrediction?.structuredFormat?.secondaryText?.text}
                </Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Home</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for places..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {loading && <ActivityIndicator size="small" color={COLORS.primary} style={styles.spinner} />}
                {error && <Text style={styles.errorText}>{error}</Text>}

                {suggestions.length > 0 && (
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => {
                            return item.placePrediction.placeId
                        }}
                        renderItem={renderSuggestionItem}
                        style={styles.suggestionsList}
                    />
                )}
            </View>
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
        marginTop: 20,
        marginBottom: 20,
    },
    searchContainer: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    searchInput: {
        height: 50,
        backgroundColor: '#282828',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: 'white',
        borderWidth: 1,
        borderColor: COLORS.seperatorBorderColor,
    },
    spinner: {
        position: 'absolute',
        right: 30,
        top: 15,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    suggestionsList: {
        maxHeight: 300,
        backgroundColor: '#282828',
        borderRadius: 8,
        marginTop: 8,
        borderColor: COLORS.seperatorBorderColor,
        borderWidth: 1,
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.littleDarker,
    },
    suggestionMainText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    suggestionSecondaryText: {
        color: COLORS.addressTextColor,
        fontSize: 13,
        marginTop: 2,
    },
});

export default HomeScreen;