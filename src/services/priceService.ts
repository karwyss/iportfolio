interface PriceData {
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
}

// Proste mapowanie nazw na ceny (symulacja pobierania)
const PRICE_MAP: { [key: string]: number } = {
  'bitcoin': 43500,
  'btc': 43500,
  'ethereum': 2800,
  'eth': 2800,
  'solana': 102,
  'sol': 102,
  'cardano': 0.45,
  'ada': 0.45,
  'dogecoin': 0.08,
  'doge': 0.08,
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

export const priceService = {
  async fetchPrice(assetName: string): Promise<PriceData | null> {
    const name = assetName.toLowerCase();
    
    // Sprawdź czy mamy cenę w mapie
    for (const key of Object.keys(PRICE_MAP)) {
      if (name.includes(key)) {
        const basePrice = PRICE_MAP[key];
        // Dodaj losową zmianę -2% do +2%
        const changePercent = (Math.random() - 0.5) * 4;
        const change = basePrice * (changePercent / 100);
        
        return {
          currentPrice: basePrice + change,
          change24h: change,
          changePercent24h: changePercent,
        };
      }
    }
    
    return null;
  },
};
