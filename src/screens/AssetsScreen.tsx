import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Asset } from '../types';
import { storageService } from '../services/storage';
import { COLORS } from '../constants';
import AssetListItem from '../components/AssetListItem';
import ConfirmPopup from '../components/ConfirmPopup';

const AssetsScreen: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadAssets = useCallback(async () => {
    const data = await storageService.getAssets();
    setAssets(data);
    const total = data.reduce(
      (sum, asset) => sum + asset.quantity * asset.price,
      0
    );
    setTotalValue(total);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAssets();
    }, [loadAssets])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  }, [loadAssets]);

  const handleDelete = (asset: Asset) => {
    setAssetToDelete(asset);
    setShowConfirmPopup(true);
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    
    setDeleteLoading(true);
    try {
      await storageService.deleteAsset(assetToDelete.id);
      setShowConfirmPopup(false);
      setAssetToDelete(null);
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmPopup(false);
    setAssetToDelete(null);
  };

  const renderItem = ({ item }: { item: Asset }) => (
    <AssetListItem
      asset={item}
      totalPortfolioValue={totalValue}
      onPress={() => handleDelete(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aktywa</Text>
        <Text style={styles.subtitle}>
          {assets.length} {assets.length === 1 ? 'aktywo' : 'aktywów'}
        </Text>
      </View>
      <FlatList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak aktywów</Text>
            <Text style={styles.emptySubtext}>
              Naciśnij zakładkę + aby dodać pierwsze aktywo
            </Text>
          </View>
        }
      />

      <ConfirmPopup
        visible={showConfirmPopup}
        title="Usuń aktywo"
        message={`Czy na pewno chcesz usunąć ${assetToDelete?.name || 'to aktywo'}? Tej operacji nie można cofnąć.`}
        confirmText="Usuń"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleteLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AssetsScreen;
