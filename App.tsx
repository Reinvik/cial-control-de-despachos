
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DispatchPanel from './components/DispatchPanel';
import HistoryPage from './components/HistoryPage';
import { DispatchZone, HistoryEntry, SortConfig, DispatchStatus } from './types';
import { loadDispatchZones, saveDispatchZones, loadHistory, saveHistory } from './utils/storage';

const App: React.FC = () => {
  const [dispatchZones, setDispatchZones] = useState<DispatchZone[]>(loadDispatchZones());
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DispatchZone | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    saveDispatchZones(dispatchZones);
  }, [dispatchZones]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const calculateRemainingTime = useCallback((targetTimeStr: string): string => {
    const [hours, minutes] = targetTimeStr.split(':').map(Number);
    const targetDateTime = new Date(currentTime);
    targetDateTime.setHours(hours, minutes, 0, 0);

    let diff = targetDateTime.getTime() - currentTime.getTime();

    if (diff < 0) {
      return "00:00:00";
    }

    const s = Math.floor((diff / 1000) % 60);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const h = Math.floor(diff / (1000 * 60 * 60));
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [currentTime]);

  const getStatus = useCallback((zone: DispatchZone): string => {
    const isInHistory = history.some(entry => entry.originalZoneId === zone.id);

    if (isInHistory) {
      return DispatchStatus.COMPLETED;
    }
    if (!zone.isActive) {
      return DispatchStatus.INACTIVE;
    }
    // If active and not in history, it's "En progreso"
    // regardless of remaining time, because "Completado" is strictly tied to history.
    return DispatchStatus.IN_PROGRESS;
  }, [history]);
  

  const handleAddZone = (zone: Omit<DispatchZone, 'id' | 'isActive'>) => {
    const newZone: DispatchZone = { 
      ...zone, 
      id: crypto.randomUUID(), 
      isActive: true, // New zones start active by default
    };
    setDispatchZones(prev => [...prev, newZone]);
  };

  const handleEditZone = (updatedZone: DispatchZone) => {
    setDispatchZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));
    setEditingZone(null);
  };
  
  const handleToggleActive = (zoneId: string) => {
    setDispatchZones(prev => prev.map(z => {
      // If a zone is in history, it cannot be reactivated from the panel.
      // Its status is fixed to "Completado".
      // To reactivate, one might need a different mechanism (e.g. remove from history or clone).
      // For now, disallow toggling active if it's "Completado".
      const isCompleted = getStatus(z) === DispatchStatus.COMPLETED;
      if (z.id === zoneId && isCompleted) {
        return z; // Do not change isActive if completed
      }
      if (z.id === zoneId) {
        return {...z, isActive: !z.isActive};
      }
      return z;
    }));
  };

  const handleDeleteZone = (zoneId: string) => {
    // Optionally, also remove from history if desired, or handle orphaned history entries.
    // Current behavior: only removes from active panel. History remains.
    setDispatchZones(prev => prev.filter(z => z.id !== zoneId));
  };

  const handleSaveToHistory = (zone: DispatchZone) => {
    // Prevent saving to history if already saved
    if (history.some(entry => entry.originalZoneId === zone.id)) {
      alert("Este zonal ya ha sido guardado en el historial.");
      // Ensure it's marked as inactive if user tries to save again (though status would be 'Completado')
      setDispatchZones(prev => prev.map(z => z.id === zone.id ? { ...z, isActive: false } : z));
      return;
    }

    const newHistoryEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      originalZoneId: zone.id, // Link to the original dispatch zone
      zonalName: zone.name,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      registeredTime: calculateRemainingTime(zone.targetTime), // Capture remaining time when saved
      targetTime: zone.targetTime,
      savedTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setHistory(prev => [newHistoryEntry, ...prev]);
    // As per Excel macro, mark as inactive after saving to history
    // This will now, in conjunction with getStatus, lead to "Completado"
    setDispatchZones(prev => prev.map(z => z.id === zone.id ? { ...z, isActive: false } : z));
  };
  
  const openEditModal = (zone: DispatchZone) => {
    setEditingZone(zone);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingZone(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentTime={currentTime} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/panel-despacho" replace />} />
            <Route 
              path="/panel-despacho" 
              element={
                <DispatchPanel
                  zones={dispatchZones}
                  history={history} // Pass history here
                  onAddZone={handleAddZone}
                  onEditZone={handleEditZone}
                  onDeleteZone={handleDeleteZone}
                  onSaveToHistory={handleSaveToHistory}
                  onToggleActive={handleToggleActive}
                  calculateRemainingTime={calculateRemainingTime}
                  getStatus={getStatus}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  editingZone={editingZone}
                  setEditingZone={setEditingZone}
                  openEditModal={openEditModal}
                  openAddModal={openAddModal}
                />
              } 
            />
            <Route path="/historial" element={<HistoryPage history={history} />} />
            <Route path="/reportes" element={<Navigate to="/historial" replace />} /> {/* Reportes redirects to Historial */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
