import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { storageService } from '../services/storage';
import { priceService } from '../services/priceService';
import { COLORS } from '../constants';
import ModalPopup from '../components/ModalPopup';

const AddAssetScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

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

  const fetchCurrentPrice = async () => {
    if (!name.trim()) {
      alert('Wpisz najpierw nazwę aktywa');
      return;
    }

    setFetchingPrice(true);
    try {
      const priceData = await priceService.fetchPrice(name.trim());
      if (priceData) {
        const formattedPrice = priceData.currentPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setPrice(formattedPrice.replace('.', ','));
        setCurrentPrice(priceData.currentPrice);
      } else {
        alert('Nie udało się pobrać ceny. Wpisz ręcznie.');
      }
    } catch (error) {
      alert('Problem z pobieraniem ceny');
    } finally {
      setFetchingPrice(false);
    }
  };

  const handleAddAsset = async () => {
    if (!name.trim()) {
      alert('Wprowadź nazwę aktywa');
      return;
    }
    
    const parsedQuantity = parseDecimal(quantity);
    const parsedPrice = parseDecimal(price);
    
    if (!quantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert('Wprowadź poprawną ilość');
      return;
    }
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Wprowadź poprawną cenę');
      return;
    }

    setLoading(true);
    try {
      await storageService.addAsset({
        name: name.trim(),
        quantity: parsedQuantity,
        price: parsedPrice,
      });
      setShowPopup(true);
    } catch (error) {
      alert('Nie udało się dodać aktywa');
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
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setCurrentPrice(null);
                }}
                placeholder="np. Bitcoin, AAPL, ETH"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.fetchButton, fetchingPrice && styles.buttonDisabled]}
                onPress={() => fetchCurrentPrice()}
                disabled={fetchingPrice || !name.trim()}
              >
                {fetchingPrice ? (
                  <ActivityIndicator size="small" color={COLORS.text} />
                ) : (
                  <Text style={styles.fetchButtonText}>Pobierz cenę</Text>
                )}
              </TouchableOpacity>
            </View>
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
            {currentPrice !== null && (
              <Text style={styles.priceInfo}>
                Pobrana cena: ${currentPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            )}
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

      <ModalPopup
        visible={showPopup}
        title="Sukces!"
        message="Aktywo zostało dodane do portfela."
        buttonText="OK"
        onClose={() => {
          setShowPopup(false);
          setName('');
          setQuantity('');
          setPrice('');
          setCurrentPrice(null);
        }}
      />
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
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputFlex: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fetchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fetchButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  priceInfo: {
    color: COLORS.success,
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default AddAssetScreen;
