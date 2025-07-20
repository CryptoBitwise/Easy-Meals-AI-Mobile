import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Animated,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';

interface ShoppingItem {
    id: string;
    name: string;
    quantity: string;
    category: string;
    completed: boolean;
}

const STORAGE_KEY = '@easymealsai:shoppingList';

export default function ShoppingListScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItem, setNewItem] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [undoItem, setUndoItem] = useState<ShoppingItem | null>(null);
    const snackbarTimeout = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        if (!loading) {
            saveItems();
        }
    }, [items]);

    const loadItems = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            } else {
                setItems([]);
            }
        } catch (e) {
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const saveItems = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            // handle error
        }
    };

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const addItem = () => {
        if (newItem.trim() && newQuantity.trim()) {
            const newShoppingItem: ShoppingItem = {
                id: Date.now().toString(),
                name: newItem.trim(),
                quantity: newQuantity.trim(),
                category: 'Other',
                completed: false,
            };
            setItems([...items, newShoppingItem]);
            setNewItem('');
            setNewQuantity('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const showSnackbar = (text: string, item: ShoppingItem) => {
        setSnackbarText(text);
        setUndoItem(item);
        setSnackbarVisible(true);
        if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
        snackbarTimeout.current = setTimeout(() => {
            setSnackbarVisible(false);
            setUndoItem(null);
        }, 3000);
    };

    const handleUndo = () => {
        if (undoItem) {
            setItems(prev => [undoItem!, ...prev]);
            setSnackbarVisible(false);
            setUndoItem(null);
        }
    };

    const removeItem = (id: string) => {
        const itemToRemove = items.find(item => item.id === id);
        setItems(items.filter(item => item.id !== id));
        if (itemToRemove) {
            showSnackbar(`Deleted "${itemToRemove.name}"`, itemToRemove);
        }
    };

    const clearList = () => {
        Alert.alert(
            'Clear Shopping List',
            'Are you sure you want to clear all items from your shopping list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => {
                        setItems([]);
                        showSnackbar('Shopping list cleared', { id: '', name: '', quantity: '', category: '', completed: false });
                    }
                }
            ]
        );
    };

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<any>,
        dragX: Animated.AnimatedInterpolation<any>,
        itemId: string
    ) => {
        return (
            <TouchableOpacity
                style={[styles.swipeDeleteButton, { backgroundColor: theme.primary }]}
                onPress={() => removeItem(itemId)}
                accessibilityLabel="Delete item"
            >
                <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }: { item: ShoppingItem }) => {
        const handleToggle = () => {
            toggleItem(item.id);
        };

        return (
            <Swipeable
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
            >
                <Animated.View
                    style={[
                        styles.itemCard,
                        {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                            shadowColor: theme.shadow,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.itemContent}
                        onPress={handleToggle}
                        accessibilityLabel={item.completed ? `Mark ${item.name} as not purchased` : `Mark ${item.name} as purchased`}
                    >
                        <View style={[styles.checkbox, { borderColor: theme.primary, backgroundColor: item.completed ? theme.primary : theme.surface }]}
                        >
                            {item.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={[
                                styles.itemName,
                                { color: theme.text },
                                item.completed && styles.completedItemName
                            ]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>{item.quantity}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem(item.id)}
                        accessibilityLabel={`Delete ${item.name}`}
                    >
                        <Ionicons name="trash-outline" size={20} color={theme.primary} />
                    </TouchableOpacity>
                </Animated.View>
            </Swipeable>
        );
    };

    const completedItems = items.filter(item => item.completed);
    const pendingItems = items.filter(item => !item.completed);
    const allCompleted = items.length > 0 && items.every(item => item.completed);

    const markAllComplete = () => {
        if (!allCompleted) {
            setItems(items.map(item => ({ ...item, completed: true })));
        }
    };

    // Group items by category
    const groupedItems = items.reduce((groups: Record<string, ShoppingItem[]>, item) => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
        return groups;
    }, {} as Record<string, ShoppingItem[]>);
    const categoryOrder = ['Vegetables', 'Meat', 'Pantry', 'Other'];
    const sortedCategories = [
        ...categoryOrder.filter(cat => groupedItems[cat]),
        ...Object.keys(groupedItems).filter(cat => !categoryOrder.includes(cat))
    ];

    // Render sectioned list
    const renderSectionedList = () => (
        <>
            {sortedCategories.map(category => (
                <View key={category} style={styles.categorySection}>
                    <Text style={[styles.categoryHeader, { color: theme.primary }]}>{category}</Text>
                    {groupedItems[category].map(item => (
                        <View key={item.id}>
                            {renderItem({ item })}
                        </View>
                    ))}
                </View>
            ))}
        </>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
                            <Ionicons name="arrow-back" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Shopping List</Text>
                        <View style={styles.headerActions}>
                            {items.length > 0 && (
                                <TouchableOpacity
                                    onPress={clearList}
                                    accessibilityLabel="Clear all items"
                                    style={styles.headerButton}
                                >
                                    <Ionicons name="trash-outline" size={20} color={theme.primary} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity accessibilityLabel="Share shopping list">
                                <Ionicons name="share-outline" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Add Item Section */}
                    <View style={[styles.addSection, { backgroundColor: theme.surface }]}>
                        <View style={styles.inputRow}>
                            <TextInput
                                ref={inputRef}
                                style={[styles.itemInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                                placeholder="Add item..."
                                value={newItem}
                                onChangeText={setNewItem}
                                placeholderTextColor={theme.textSecondary}
                                returnKeyType="next"
                                onSubmitEditing={() => inputRef.current?.focus()}
                                accessibilityLabel="Item name"
                            />
                            <TextInput
                                style={[styles.quantityInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                                placeholder="Qty"
                                value={newQuantity}
                                onChangeText={setNewQuantity}
                                placeholderTextColor={theme.textSecondary}
                                returnKeyType="done"
                                onSubmitEditing={addItem}
                                accessibilityLabel="Quantity"
                            />
                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: (newItem.trim() && newQuantity.trim()) ? theme.primary : theme.border }]}
                                onPress={addItem}
                                disabled={!(newItem.trim() && newQuantity.trim())}
                                accessibilityLabel="Add item"
                            >
                                <Ionicons name="add" size={24} color={(newItem.trim() && newQuantity.trim()) ? '#fff' : theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Progress */}
                    <View style={styles.progressSection}>
                        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                            {completedItems.length} of {items.length} items completed
                        </Text>
                        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { backgroundColor: theme.primary, width: `${(completedItems.length / (items.length || 1)) * 100}%` }
                                ]}
                            />
                        </View>
                    </View>

                    {/* Items List (Grouped by Category) */}
                    <View style={styles.itemsList}>
                        {items.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="list-outline" size={48} color={theme.textSecondary} />
                                <Text style={[styles.emptyText, { color: theme.text }]}>Your shopping list is empty</Text>
                                <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Add items to get started</Text>
                            </View>
                        ) : (
                            renderSectionedList()
                        )}
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                            onPress={() => navigation.navigate('AIShoppingList')}
                            accessibilityLabel="Go to AI Shopping List"
                        >
                            <Ionicons name="bulb-outline" size={20} color={theme.primary} />
                            <Text style={[styles.actionButtonText, { color: theme.primary }]}>AI Shopping List</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, allCompleted && { opacity: 0.5 }, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                            onPress={markAllComplete}
                            disabled={allCompleted}
                            accessibilityLabel="Mark all items as complete"
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color={theme.primary} />
                            <Text style={[styles.actionButtonText, { color: theme.primary }]}>Mark All Complete</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Snackbar */}
                    {snackbarVisible && (
                        <View style={[styles.snackbar, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
                            <Text style={[styles.snackbarText, { color: theme.text }]}>{snackbarText}</Text>
                            <TouchableOpacity onPress={handleUndo} accessibilityLabel="Undo delete">
                                <Text style={[styles.snackbarAction, { color: theme.primary }]}>UNDO</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
        marginRight: 8,
    },
    addSection: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginRight: 10,
    },
    quantityInput: {
        width: 80,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressSection: {
        padding: 20,
        backgroundColor: '#fff',
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
    },
    progressFill: {
        height: 4,
        backgroundColor: '#4CAF50',
        borderRadius: 2,
    },
    itemsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        color: '#333',
        marginBottom: 2,
    },
    completedItemName: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    removeButton: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
    },
    quickActions: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginLeft: 6,
    },
    swipeDeleteButton: {
        backgroundColor: '#E91E63',
        justifyContent: 'center',
        alignItems: 'center',
        width: 64,
        height: '90%',
        marginVertical: 6,
        borderRadius: 12,
        alignSelf: 'center',
    },
    snackbar: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 40,
        backgroundColor: '#333',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    snackbarText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    snackbarAction: {
        color: '#4CAF50',
        fontWeight: 'bold',
        marginLeft: 24,
        fontSize: 16,
    },
    categorySection: {
        marginBottom: 18,
    },
    categoryHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 8,
        marginLeft: 8,
    },
}); 