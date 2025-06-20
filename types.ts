
export interface DispatchZone {
  id: string;
  name: string;
  targetTime: string; // HH:MM format
  isActive: boolean;
}

export interface HistoryEntry {
  id: string;
  originalZoneId: string; // ID of the DispatchZone this history entry was created from
  zonalName: string;
  date: string; // DD-MM-YYYY
  registeredTime: string; // HH:MM:SS (countdown value when saved)
  targetTime: string; // HH:MM
  savedTime: string; // HH:MM:SS (actual time of saving)
}

export interface SortConfig {
  key: keyof DispatchZone | 'status' | 'remainingTime';
  direction: 'ascending' | 'descending';
}

export enum DispatchStatus {
  INACTIVE = "Inactivo",
  IN_PROGRESS = "En progreso",
  COMPLETED = "Completado",
}