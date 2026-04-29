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
    const symbols: { [key: string]: string } = {
      'apple': 'AAPL',
      'aapl': 'AAPL',
      'tesla': 'TSLA',
      'tsla': 'TSLA',
      'amazon': 'AMZN',
      'google': 'GOOGL',
      'microsoft': 'MSFT',
    };
    
    const symbol = symbols[name];
    if (!symbol) return null;

    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      const result = data.chart.result[0];
      const meta = result.meta;
      const quotes = result.indicators.quote[0];
      
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose;
      const change24h = currentPrice - previousClose;
      const changePercent24h = (change24h / previousClose) * 100;
      
      return { currentPrice, change24h, changePercent24h };
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return null;
    }
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
