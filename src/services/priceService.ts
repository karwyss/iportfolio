interface PriceData {
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
}

  const COINGECKO_IDS: { [key: string]: string } = {
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
  };

export const priceService = {
  async fetchCryptoPrice(assetName: string): Promise<PriceData | null> {
    const name = assetName.toLowerCase();
    const coinId = COINGECKO_IDS[name];
    
    if (!coinId) return null;

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      const currentPrice = data.market_data.current_price.usd;
      const change24h = data.market_data.price_change_24h;
      const changePercent24h = data.market_data.price_change_percentage_24h;
      
      return { currentPrice, change24h, changePercent24h };
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      return null;
    }
  },

  async fetchStockPrice(assetName: string): Promise<PriceData | null> {
    const name = assetName.toLowerCase();
    
    // Mock prices dla akcji (Yahoo Finance często blokuje)
    const mockPrices: { [key: string]: number } = {
      'apple': 185.50,
      'aapl': 185.50,
      'tesla': 245.30,
      'tsla': 245.30,
      'amazon': 178.25,
      'amzn': 178.25,
      'google': 141.80,
      'googl': 141.80,
      'microsoft': 378.90,
      'msft': 378.90,
      'netflix': 425.60,
      'nflx': 425.60,
      'meta': 325.40,
      'facebook': 325.40,
      'fb': 325.40,
      'nvidia': 875.20,
      'nvda': 875.20,
      'amd': 142.30,
      'intel': 43.50,
      'intc': 43.50,
      'jp morgan': 198.70,
      'jpm': 198.70,
      'goldman sachs': 412.30,
      'gs': 412.30,
      'bank of america': 34.20,
      'bac': 34.20,
    };
    
    const price = mockPrices[name];
    if (!price) return null;
    
    // Generuj losową zmianę -2% do +2%
    const changePercent = (Math.random() - 0.5) * 4;
    const change = price * (changePercent / 100);
    
    return {
      currentPrice: price + change,
      change24h: change,
      changePercent24h: changePercent,
    };
  },

  async fetchPrice(assetName: string): Promise<PriceData | null> {
    const cryptoData = await this.fetchCryptoPrice(assetName);
    if (cryptoData) return cryptoData;
    
    const stockData = await this.fetchStockPrice(assetName);
    if (stockData) return stockData;
    
    return null;
  },

  generateMockChange(currentPrice: number): PriceData {
    const changePercent = (Math.random() - 0.5) * 10;
    const change = currentPrice * (changePercent / 100);
    return {
      currentPrice: currentPrice + change,
      change24h: change,
      changePercent24h: changePercent,
    };
  },
};
