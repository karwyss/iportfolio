import { MaterialCommunityIcons } from '@expo/vector-icons';

export const getAssetIconName = (assetName: string): string => {
  const name = assetName.toLowerCase();
  
  const iconMap: { [key: string]: string } = {
    'bitcoin': 'bitcoin',
    'btc': 'bitcoin',
    'ethereum': 'ethereum',
    'eth': 'ethereum',
    'solana': 'solana',
    'sol': 'solana',
    'cardano': 'cardano',
    'ada': 'cardano',
    'dogecoin': 'dogecoin',
    'doge': 'dogecoin',
    'apple': 'apple',
    'aapl': 'apple',
    'tesla': 'car',
    'tsla': 'car',
    'amazon': 'amazon',
    'amzn': 'amazon',
    'google': 'google',
    'googl': 'google',
    'microsoft': 'microsoft',
    'msft': 'microsoft',
    'gold': 'gold',
    'silver': 'silver',
    'stock': 'chart-line',
    'fund': 'chart-pie',
    'index': 'chart-bar',
  };

  for (const key of Object.keys(iconMap)) {
    if (name.includes(key)) {
      return iconMap[key];
    }
  }

  return 'cash';
};

export const getAvailableIcons = (): string[] => {
  return [
    'bitcoin', 'ethereum', 'solana', 'cardano', 'dogecoin',
    'apple', 'car', 'amazon', 'google', 'microsoft',
    'gold', 'silver', 'chart-line', 'chart-pie', 'chart-bar',
    'cash', 'currency-usd', 'currency-eur', 'bank', 'trending-up'
  ];
};
