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
    'polkadot': 'polkadot',
    'dot': 'polkadot',
    'avalanche': 'avalanche-2',
    'avax': 'avalanche-2',
    'chainlink': 'chainlink',
    'link': 'chainlink',
    'litecoin': 'litecoin',
    'ltc': 'litecoin',
    'ripple': 'ripple',
    'xrp': 'ripple',
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
    'netflix': 'popcorn',
    'nflx': 'popcorn',
    'meta': 'facebook',
    'fb': 'facebook',
    'facebook': 'facebook',
    'nvidia': 'chip',
    'nvda': 'chip',
    'amd': 'chip',
    'intel': 'chip',
    'intc': 'chip',
    'jp morgan': 'bank',
    'jpm': 'bank',
    'goldman sachs': 'bank',
    'gs': 'bank',
    'bank of america': 'bank',
    'bac': 'bank',
    'gold': 'gold',
    'silver': 'silver',
    'stock': 'chart-line',
    'fund': 'chart-pie',
    'index': 'chart-bar',
    'etf': 'chart-bar',
    's&p500': 'chart-bar',
    'nasdaq': 'chart-bar',
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
