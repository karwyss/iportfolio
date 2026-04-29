import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { Asset, PortfolioSummary } from '../types';
import { storageService } from '../services/storage';
import { priceService } from '../services/priceService';
import { COLORS, CHART_COLORS } from '../constants';
import PortfolioCard from '../components/PortfolioCard';
import AssetListItem from '../components/AssetListItem';

const HomeScreen: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalChange: 0,
    totalChangePercent: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAssets = useCallback(async () => {
    const data = await storageService.getAssets();
    setAssets(data);
    return data;
  }, []);

  const updatePrices = useCallback(async (assetsList: Asset[]) => {
    if (assetsList.length === 0) {
      setSummary({ totalValue: 0, totalChange: 0, totalChangePercent: 0 });
      setLoading(false);
      return;
    }

    let totalValue = 0;
    let totalPreviousValue = 0;
    const updatedAssets = [...assetsList];

    for (let i = 0; i < updatedAssets.length; i++) {
      const asset = updatedAssets[i];
      const priceData = await priceService.fetchPrice(asset.name);
      
      if (priceData) {
        const newValue = asset.quantity * priceData.currentPrice;
        const previousValue = asset.quantity * (priceData.currentPrice - priceData.change24h);
        
        totalValue += newValue;
        totalPreviousValue += previousValue;
        
        updatedAssets[i] = { 
          ...asset, 
          price: priceData.currentPrice,
          changePercent: priceData.changePercent24h 
        };
      } else {
        totalValue += asset.quantity * asset.price;
        totalPreviousValue += asset.quantity * asset.price;
      }
    }

    const totalChange = totalValue - totalPreviousValue;
    const totalChangePercent = totalPreviousValue > 0 
      ? (totalChange / totalPreviousValue) * 100 
      : 0;

    setSummary({
      totalValue,
      totalChange,
      totalChangePercent,
    });

    if (JSON.stringify(updatedAssets) !== JSON.stringify(assetsList)) {
      await storageService.saveAssets(updatedAssets);
      setAssets(updatedAssets);
    }

    setLoading(false);
  }, []);

  const calculateSummary = useCallback(async () => {
    setLoading(true);
    const data = await loadAssets();
    await updatePrices(data);
  }, [loadAssets, updatePrices]);

  useFocusEffect(
    React.useCallback(() => {
      calculateSummary();
    }, [calculateSummary])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      calculateSummary();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [calculateSummary]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await calculateSummary();
    setRefreshing(false);
  }, [calculateSummary]);

  const getPieChartData = () => {
    return assets.map((asset) => ({
      name: asset.name,
      value: asset.quantity * asset.price,
      color: asset.color || CHART_COLORS[0],
      legendFontColor: COLORS.textSecondary,
      legendFontSize: 12,
    }));
  };

  const renderPieChart = () => {
    if (assets.length === 0) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Alokacja portfela</Text>
        <PieChart
          data={getPieChartData()}
          width={320}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Aktualizacja cen...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      <PortfolioCard summary={summary} />
      {renderPieChart()}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Twoje aktywa</Text>
        {assets.length === 0 ? (
          <Text style={styles.emptyText}>Brak aktywów. Dodaj pierwsze!</Text>
        ) : (
          assets.map((asset) => (
            <AssetListItem
              key={asset.id}
              asset={asset}
              totalPortfolioValue={summary.totalValue}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
