import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { storageService } from '../services/storage';
import { COLORS } from '../constants';

const AddAssetScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const parseDecimal = (value: string): number => {
    return Number(value.replace(',', '.'));
  };

  const handleQuantityChange = (text: string) => {
    const cleaned = text.replace(/[^0-9,]/g, '');
    setQuantity(cleaned);
  };

  const handlePriceChange = (text: string) => {
    const cleaned = text.replace(/[^0-9,]/g, '');
    setPrice(cleaned);
  };

  const handleAddAsset = async () => {
    if (!name.trim()) {
      Alert.alert('Błąd', 'Wprowadź nazwę aktywa');
      return;
    }
    
    const parsedQuantity = parseDecimal(quantity);
    const parsedPrice = parseDecimal(price);
    
    if (!quantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Błąd', 'Wprowadź poprawną ilość');
      return;
    }
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Błąd', 'Wprowadź poprawną cenę');
      return;
    }

    setLoading(true);
    try {
      await storageService.addAsset({
        name: name.trim(),
        quantity: parsedQuantity,
        price: parsedPrice,
      });
      Alert.alert('Sukces', 'Aktywo zostało dodane!', [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setQuantity('');
            setPrice('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać aktywa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dodaj nowe aktywo</Text>
          <Text style={styles.subtitle}>
            Wprowadź szczegóły inwestycji
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nazwa aktywa</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="np. Bitcoin, AAPL, ETH"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ilość</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={handleQuantityChange}
              placeholder="np. 0,5 lub 1,25"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cena za jednostkę ($)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={handlePriceChange}
              placeholder="np. 50 000 lub 43500"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          {quantity && price && !isNaN(parseDecimal(quantity)) && !isNaN(parseDecimal(price)) && (
            <View style={styles.totalPreview}>
              <Text style={styles.totalLabel}>Wartość całkowita</Text>
              <Text style={styles.totalValue}>
                $
                {(parseDecimal(quantity) * parseDecimal(price)).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAddAsset}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Dodawanie...' : 'Dodaj aktywo'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  totalPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddAssetScreen;
