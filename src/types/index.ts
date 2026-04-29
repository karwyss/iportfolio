export interface Asset {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color?: string;
  changePercent?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
}

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Assets: undefined;
  AddAsset: undefined;
};
