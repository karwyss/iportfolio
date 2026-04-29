import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PortfolioSummary } from '../types';
import { COLORS } from '../constants';

interface PortfolioCardProps {
  summary: PortfolioSummary;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ summary }) => {
  const isPositive = summary.totalChangePercent >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wartość portfela</Text>
      <Text style={styles.totalValue}>
        ${summary.totalValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
      <View style={styles.changeContainer}>
        <View
          style={[
            styles.changeBadge,
            { backgroundColor: isPositive ? COLORS.success + '20' : COLORS.danger + '20' },
          ]}
        >
          <Text
            style={[
              styles.changeText,
              { color: isPositive ? COLORS.success : COLORS.danger },
            ]}
          >
            {isPositive ? '+' : ''}
            {summary.totalChangePercent.toFixed(2)}%
          </Text>
        </View>
        <Text style={styles.changeValue}>
          {isPositive ? '+' : ''}$
          {summary.totalChange.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeValue: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export default PortfolioCard;
