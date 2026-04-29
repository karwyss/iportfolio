import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from '../types';
import { STORAGE_KEY, CHART_COLORS } from '../constants';

export const storageService = {
  async getAssets(): Promise<Asset[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error loading assets:', error);
      return [];
    }
  },

  async saveAssets(assets: Asset[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    } catch (error) {
      console.error('Error saving assets:', error);
    }
  },

  async addAsset(asset: Omit<Asset, 'id' | 'color'>): Promise<Asset[]> {
    try {
      const assets = await this.getAssets();
      const newAsset: Asset = {
        ...asset,
        id: Date.now().toString(),
        color: CHART_COLORS[assets.length % CHART_COLORS.length],
      };
      const updatedAssets = [...assets, newAsset];
      await this.saveAssets(updatedAssets);
      return updatedAssets;
    } catch (error) {
      console.error('Error adding asset:', error);
      return [];
    }
  },

  async deleteAsset(id: string): Promise<Asset[]> {
    try {
      const assets = await this.getAssets();
      const updatedAssets = assets.filter(asset => asset.id !== id);
      await this.saveAssets(updatedAssets);
      return updatedAssets;
    } catch (error) {
      console.error('Error deleting asset:', error);
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing assets:', error);
    }
  },
};
