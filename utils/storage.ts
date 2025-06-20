
import { DispatchZone, HistoryEntry } from '../types';

const DISPATCH_ZONES_KEY = 'cialDispatchZones';
const HISTORY_KEY = 'cialDispatchHistory';

export const loadDispatchZones = (): DispatchZone[] => {
  try {
    const data = localStorage.getItem(DISPATCH_ZONES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading dispatch zones from localStorage:", error);
    return [];
  }
};

export const saveDispatchZones = (zones: DispatchZone[]): void => {
  try {
    localStorage.setItem(DISPATCH_ZONES_KEY, JSON.stringify(zones));
  } catch (error) {
    console.error("Error saving dispatch zones to localStorage:", error);
  }
};

export const loadHistory = (): HistoryEntry[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading history from localStorage:", error);
    return [];
  }
};

export const saveHistory = (history: HistoryEntry[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving history to localStorage:", error);
  }
};
