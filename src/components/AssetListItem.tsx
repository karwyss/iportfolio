import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Asset } from '../types';
import { COLORS } from '../constants';
import { getAssetIconName } from '../utils/iconMapper';

interface AssetListItemProps {
  asset: Asset;
  totalPortfolioValue: number;
  onPress?: () => void;
}

const AssetListItem: React.FC<AssetListItemProps> = ({
  asset,
  totalPortfolioValue,
  onPress,
}) => {
  const totalValue = asset.quantity * asset.price;
  const percentage =
    totalPortfolioValue > 0 ? (totalValue / totalPortfolioValue) * 100 : 0;
  const iconName = getAssetIconName(asset.name) as any;
  const isPositiveChange = (asset.changePercent || 0) >= 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: asset.color || COLORS.primary + '20' },
          ]}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={18}
            color={asset.color || COLORS.primary}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.quantity}>{asset.quantity} units</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.value}>
          ${totalValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <View style={styles.changeContainer}>
          <Text style={styles.percentage}>{percentage.toFixed(2)}%</Text>
          {asset.changePercent !== undefined && (
            <Text
              style={[
                styles.changePercent,
                { color: isPositiveChange ? COLORS.success : COLORS.danger },
              ]}
            >
              {isPositiveChange ? '+' : ''}
              {asset.changePercent.toFixed(2)}%
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quantity: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  percentage: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  changePercent: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AssetListItem;
