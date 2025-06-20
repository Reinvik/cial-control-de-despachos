
import React, { useState, useMemo } from 'react';
import { DispatchZone, SortConfig, DispatchStatus, HistoryEntry } from '../types';
import AddZoneModal from './AddZoneModal';
import DispatchRow from './DispatchRow';
import { PlusIcon, SortAscIcon, SortDescIcon, SortIcon } from './icons';

interface DispatchPanelProps {
  zones: DispatchZone[];
  history: HistoryEntry[]; // Added history prop
  onAddZone: (zone: Omit<DispatchZone, 'id' | 'isActive'>) => void;
  onEditZone: (zone: DispatchZone) => void;
  onDeleteZone: (zoneId: string) => void;
  onSaveToHistory: (zone: DispatchZone) => void;
  onToggleActive: (zoneId: string) => void;
  calculateRemainingTime: (targetTime: string) => string;
  getStatus: (zone: DispatchZone) => string;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingZone: DispatchZone | null;
  setEditingZone: (zone: DispatchZone | null) => void;
  openEditModal: (zone: DispatchZone) => void;
  openAddModal: () => void;
}

const DispatchPanel: React.FC<DispatchPanelProps> = ({
  zones,
  history, // Use history prop
  onAddZone,
  onEditZone,
  onDeleteZone,
  onSaveToHistory,
  onToggleActive,
  calculateRemainingTime,
  getStatus,
  isModalOpen,
  setIsModalOpen,
  editingZone,
  setEditingZone,
  openEditModal,
  openAddModal
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'status', direction: 'ascending' });

  const sortedZones = useMemo(() => {
    let sortableItems = [...zones];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === 'status') {
          const statusOrder = { [DispatchStatus.IN_PROGRESS]: 1, [DispatchStatus.COMPLETED]: 2, [DispatchStatus.INACTIVE]: 3 };
          aValue = statusOrder[getStatus(a) as DispatchStatus] || 99;
          bValue = statusOrder[getStatus(b) as DispatchStatus] || 99;
        } else if (sortConfig.key === 'remainingTime') {
          // For sorting, we still use the dynamic remaining time or a representation of it.
          // The display logic for freezing time is handled separately when rendering DispatchRow.
          const getSortableTime = (zone: DispatchZone): string => {
            const status = getStatus(zone);
            if (status === DispatchStatus.COMPLETED) {
              const histEntry = history.find(h => h.originalZoneId === zone.id);
              return histEntry ? histEntry.registeredTime : "00:00:00";
            }
            if (status === DispatchStatus.INACTIVE) {
                return "00:00:00";
            }
            return calculateRemainingTime(zone.targetTime);
          }
          const remainingA = getSortableTime(a);
          const remainingB = getSortableTime(b);
          
          aValue = remainingA.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          bValue = remainingB.split(':').reduce((acc, time) => (60 * acc) + +time, 0);

        } else { // 'name' or 'targetTime'
            aValue = a[sortConfig.key as keyof Omit<DispatchZone, 'id' | 'isActive'>];
            bValue = b[sortConfig.key as keyof Omit<DispatchZone, 'id' | 'isActive'>];
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [zones, sortConfig, getStatus, calculateRemainingTime, history]);

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortConfig['key']) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <SortIcon className="h-4 w-4 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? <SortAscIcon className="h-4 w-4 ml-1" /> : <SortDescIcon className="h-4 w-4 ml-1" />;
  };
  
  const headers: { key: SortConfig['key']; label: string }[] = [
    { key: 'name', label: 'Zonal' },
    { key: 'targetTime', label: 'Hora Obj.' },
    { key: 'remainingTime', label: 'Restante' },
    { key: 'status', label: 'Estado' },
  ];

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Panel de Despacho Activo</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Zonal de Despacho
        </button>
      </div>

      <div className="overflow-x-auto table-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Act.</th>
              {headers.map((header) => (
                <th
                  key={header.key}
                  onClick={() => requestSort(header.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                >
                  <div className="flex items-center">
                    {header.label}
                    {getSortIcon(header.key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedZones.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No hay zonales de despacho activas. Haga clic en "Agregar Zonal de Despacho" para comenzar.
                </td>
              </tr>
            )}
            {sortedZones.map((zone) => {
              const status = getStatus(zone);
              let displayedTime: string;

              if (status === DispatchStatus.COMPLETED) {
                const historyEntry = history.find(h => h.originalZoneId === zone.id);
                displayedTime = historyEntry ? historyEntry.registeredTime : "00:00:00";
              } else if (status === DispatchStatus.INACTIVE) { // !zone.isActive && status is not COMPLETED
                displayedTime = "00:00:00";
              } else { // status === DispatchStatus.IN_PROGRESS
                displayedTime = calculateRemainingTime(zone.targetTime);
              }

              return (
                <DispatchRow
                  key={zone.id}
                  zone={zone}
                  onEdit={() => openEditModal(zone)}
                  onDelete={onDeleteZone}
                  onSaveToHistory={onSaveToHistory}
                  onToggleActive={onToggleActive}
                  displayedRemainingTime={displayedTime}
                  status={status}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddZoneModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingZone(null); }}
          onSave={editingZone ? onEditZone : onAddZone}
          existingZone={editingZone}
        />
      )}
    </div>
  );
};

export default DispatchPanel;
