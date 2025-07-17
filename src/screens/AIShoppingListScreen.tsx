import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
// import Voice from '@react-native-community/voice';

interface ShoppingItem {
    id: string;
    name: string;
    quantity: string;
    category: string;
    completed: boolean;
    estimatedPrice?: string;
}

interface ShoppingList {
    id: string;
    name: string;
    items: ShoppingItem[];
    totalEstimatedCost: string;
    createdAt: Date;
}

export default function AIShoppingListScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [isGenerating, setIsGenerating] = useState(false);
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [isListening, setIsListening] = useState(false);

    // Voice recognition handlers
    useEffect(() => {
        // Voice.onSpeechStart = onSpeechStart;
        // Voice.onSpeechEnd = onSpeechEnd;
        // Voice.onSpeechResults = onSpeechResults;
        // Voice.onSpeechError = onSpeechError;
        return () => {
            // Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // const onSpeechStart = () => {
    //     setIsListening(true);
    // };
    // const onSpeechEnd = () => {
    //     setIsListening(false);
    // };
    // const onSpeechResults = (event: any) => {
    //     if (event.value && event.value.length > 0) {
    //         setNewItemName(event.value[0]);
    //     }
    //     setIsListening(false);
    // };
    // const onSpeechError = (event: any) => {
    //     setIsListening(false);
    //     Alert.alert('Voice Error', event.error?.message || 'Could not recognize speech.');
    // };

    // const startListening = async () => {
    //     try {
    //         setIsListening(true);
    //         await Voice.start('en-US');
    //     } catch (e) {
    //         setIsListening(false);
    //         Alert.alert('Voice Error', 'Could not start voice recognition.');
    //     }
    // };
    // const stopListening = async () => {
    //     try {
    //         await Voice.stop();
    //         setIsListening(false);
    //     } catch (e) {
    //         setIsListening(false);
    //     }
    // };

    const generateShoppingList = async () => {
        setIsGenerating(true);

        // Simulate AI shopping list generation
        setTimeout(() => {
            const newList = createAIShoppingList();
            setShoppingLists(prev => [newList, ...prev]);
            setIsGenerating(false);

            Alert.alert(
                'Shopping List Generated!',
                'Your AI-powered shopping list is ready with estimated costs.',
                [{ text: 'OK' }]
            );
        }, 2000);
    };

    const createAIShoppingList = (): ShoppingList => {
        const items: ShoppingItem[] = [
            {
                id: '1',
                name: 'Chicken breast',
                quantity: '2 lbs',
                category: 'Meat',
                completed: false,
                estimatedPrice: '$8.99',
            },
            {
                id: '2',
                name: 'Broccoli',
                quantity: '1 head',
                category: 'Vegetables',
                completed: false,
                estimatedPrice: '$2.49',
            },
            {
                id: '3',
                name: 'Bell peppers',
                quantity: '3 pieces',
                category: 'Vegetables',
                completed: false,
                estimatedPrice: '$3.99',
            },
            {
                id: '4',
                name: 'Soy sauce',
                quantity: '1 bottle',
                category: 'Pantry',
                completed: false,
                estimatedPrice: '$4.29',
            },
            {
                id: '5',
                name: 'Olive oil',
                quantity: '1 bottle',
                category: 'Pantry',
                completed: false,
                estimatedPrice: '$6.99',
            },
            {
                id: '6',
                name: 'Garlic',
                quantity: '1 bulb',
                category: 'Vegetables',
                completed: false,
                estimatedPrice: '$1.29',
            },
            {
                id: '7',
                name: 'Brown rice',
                quantity: '2 cups',
                category: 'Grains',
                completed: false,
                estimatedPrice: '$2.99',
            },
            {
                id: '8',
                name: 'Greek yogurt',
                quantity: '1 container',
                category: 'Dairy',
                completed: false,
                estimatedPrice: '$4.49',
            },
            {
                id: '9',
                name: 'Mixed berries',
                quantity: '1 package',
                category: 'Fruits',
                completed: false,
                estimatedPrice: '$5.99',
            },
            {
                id: '10',
                name: 'Almonds',
                quantity: '1 cup',
                category: 'Nuts',
                completed: false,
                estimatedPrice: '$7.99',
            },
        ];

        const totalCost = items.reduce((sum, item) => {
            const price = parseFloat(item.estimatedPrice?.replace('$', '') || '0');
            return sum + price;
        }, 0);

        return {
            id: Date.now().toString(),
            name: `AI Shopping List - ${new Date().toLocaleDateString()}`,
            items,
            totalEstimatedCost: `$${totalCost.toFixed(2)}`,
            createdAt: new Date(),
        };
    };

    const addItem = () => {
        if (newItemName.trim() && newItemQuantity.trim()) {
            const newItem: ShoppingItem = {
                id: Date.now().toString(),
                name: newItemName.trim(),
                quantity: newItemQuantity.trim(),
                category: 'Other',
                completed: false,
                estimatedPrice: '$0.00',
            };

            if (shoppingLists.length > 0) {
                const updatedLists = shoppingLists.map((list, index) => {
                    if (index === 0) {
                        return {
                            ...list,
                            items: [...list.items, newItem],
                        };
                    }
                    return list;
                });
                setShoppingLists(updatedLists);
            }

            setNewItemName('');
            setNewItemQuantity('');
        }
    };

    const toggleItem = (listId: string, itemId: string) => {
        setShoppingLists(prev => prev.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    items: list.items.map(item =>
                        item.id === itemId ? { ...item, completed: !item.completed } : item
                    ),
                };
            }
            return list;
        }));
    };

    const removeItem = (listId: string, itemId: string) => {
        setShoppingLists(prev => prev.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    items: list.items.filter(item => item.id !== itemId),
                };
            }
            return list;
        }));
    };

    const renderShoppingItem = ({ item }: { item: ShoppingItem }) => (
        <View style={[styles.itemCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
            <TouchableOpacity
                style={styles.itemContent}
                onPress={() => toggleItem(shoppingLists[0]?.id || '', item.id)}
            >
                <View style={styles.checkbox}>
                    {item.completed && <Ionicons name="checkmark" size={16} color="#4CAF50" />}
                </View>
                <View style={styles.itemInfo}>
                    <Text style={[
                        styles.itemName,
                        item.completed && styles.completedItemName,
                        { color: item.completed ? theme.textSecondary : theme.text }
                    ]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                        {item.quantity}
                    </Text>
                </View>
                <View style={styles.itemPrice}>
                    <Text style={[styles.priceText, { color: theme.primary }]}>
                        {item.estimatedPrice}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(shoppingLists[0]?.id || '', item.id)}
            >
                <Ionicons name="trash-outline" size={20} color="#E91E63" />
            </TouchableOpacity>
        </View>
    );

    const renderShoppingList = ({ item }: { item: ShoppingList }) => (
        <View style={styles.listContainer}>
            <View style={[styles.listHeader, { backgroundColor: theme.surface }]}>
                <View>
                    <Text style={[styles.listName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.listDate, { color: theme.textSecondary }]}>
                        {item.createdAt.toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.listTotal}>
                    <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total</Text>
                    <Text style={[styles.totalAmount, { color: theme.primary }]}>
                        {item.totalEstimatedCost}
                    </Text>
                </View>
            </View>

            <FlatList
                data={item.items}
                renderItem={renderShoppingItem}
                keyExtractor={(item) => item.id}
                style={styles.itemsList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="list-outline" size={24} color={theme.primary} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>AI Shopping Lists</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="share-outline" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Generate Button */}
            <View style={styles.generateSection}>
                <TouchableOpacity
                    style={[styles.generateButton, { backgroundColor: theme.primary }]}
                    onPress={generateShoppingList}
                    disabled={isGenerating}
                >
                    <Ionicons name="bulb-outline" size={24} color="#fff" />
                    <Text style={styles.generateButtonText}>
                        {isGenerating ? 'Generating Shopping List...' : 'Generate AI Shopping List'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Add Item Section */}
            {shoppingLists.length > 0 && (
                <View style={[styles.addSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity
                            style={[styles.micButton, isListening ? styles.micButtonActive : null]}
                        // onPress={isListening ? stopListening : startListening}
                        >
                            <Ionicons name={isListening ? 'mic' : 'mic-outline'} size={20} color={isListening ? '#fff' : theme.primary} />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.itemInput, {
                                backgroundColor: theme.background,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="Add item..."
                            placeholderTextColor={theme.textSecondary}
                            value={newItemName}
                            onChangeText={setNewItemName}
                        />
                        <TextInput
                            style={[styles.quantityInput, {
                                backgroundColor: theme.background,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="Qty"
                            placeholderTextColor={theme.textSecondary}
                            value={newItemQuantity}
                            onChangeText={setNewItemQuantity}
                        />
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.primary }]}
                            onPress={addItem}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Shopping Lists */}
            {shoppingLists.length > 0 ? (
                <FlatList
                    data={shoppingLists}
                    renderItem={renderShoppingList}
                    keyExtractor={(item) => item.id}
                    style={styles.listsContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="list-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.text }]}>
                        No shopping lists yet
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                        Generate an AI-powered shopping list to get started
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    generateSection: {
        padding: 20,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    addSection: {
        padding: 20,
        borderBottomWidth: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginRight: 10,
    },
    quantityInput: {
        width: 80,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginRight: 10,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listsContainer: {
        flex: 1,
        padding: 20,
    },
    listContainer: {
        marginBottom: 20,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    listDate: {
        fontSize: 12,
    },
    listTotal: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 12,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemsList: {
        flex: 1,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    completedItemName: {
        textDecorationLine: 'line-through',
    },
    itemQuantity: {
        fontSize: 14,
    },
    itemPrice: {
        marginRight: 15,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '600',
    },
    removeButton: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        lineHeight: 20,
    },
    micButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#4CAF50',
        backgroundColor: '#fff',
    },
    micButtonActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
}); 