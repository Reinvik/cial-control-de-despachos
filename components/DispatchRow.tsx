
import React from 'react';
import { DispatchZone, DispatchStatus } from '../types';
import { EditIcon, DeleteIcon, SaveToHistoryIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from './icons'; 

interface DispatchRowProps {
  zone: DispatchZone;
  displayedRemainingTime: string; // Changed from remainingTime
  status: string;
  onEdit: (zone: DispatchZone) => void;
  onDelete: (zoneId: string) => void;
  onSaveToHistory: (zone: DispatchZone) => void;
  onToggleActive: (zoneId: string) => void;
}

const DispatchRow: React.FC<DispatchRowProps> = ({
  zone,
  displayedRemainingTime, // Changed from remainingTime
  status,
  onEdit,
  onDelete,
  onSaveToHistory,
  onToggleActive,
}) => {
  const isCompleted = status === DispatchStatus.COMPLETED;

  const statusColor = status === DispatchStatus.IN_PROGRESS ? "text-yellow-600" :
                      isCompleted ? "text-green-600" :
                      "text-gray-500";
  
  const remainingTimeColor = displayedRemainingTime === "00:00:00" && status === DispatchStatus.IN_PROGRESS 
                           ? "text-red-600 font-semibold" 
                           : "text-gray-700";

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${!zone.isActive && !isCompleted ? 'opacity-70 bg-gray-50' : (isCompleted ? 'opacity-70 bg-gray-50' : '')}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <button 
          onClick={() => onToggleActive(zone.id)} 
          className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isCompleted}
          title={isCompleted ? "Zonal completado (en historial), no se puede reactivar desde aquí." : (zone.isActive ? "Marcar como Inactivo" : "Marcar como Activo")}
        >
          {zone.isActive && !isCompleted ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
          ) : (
            isCompleted ? 
            <CheckCircleIcon className="h-6 w-6 text-green-500" /> : // Completed items show check (disabled)
            <XCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" /> // Inactive (not completed) show X
          )}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{zone.targetTime}</td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${remainingTimeColor}`}>
        {displayedRemainingTime}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${statusColor}`}>
        <div className="flex items-center">
            {status === DispatchStatus.IN_PROGRESS && <ClockIcon className="h-4 w-4 mr-1 animate-pulse"/>}
            {isCompleted && <CheckCircleIcon className="h-4 w-4 mr-1"/>}
            {status === DispatchStatus.INACTIVE && <XCircleIcon className="h-4 w-4 mr-1"/>}
            {status}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
        <button 
          onClick={() => onEdit(zone)} 
          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          title="Editar Zonal"
          disabled={isCompleted} 
        >
          <EditIcon className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onSaveToHistory(zone)} 
          className="text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          title={isCompleted ? "Zonal ya está en el historial" : "Guardar en Historial y Marcar como Completado"}
          disabled={isCompleted}
        >
          <SaveToHistoryIcon className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onDelete(zone.id)} 
          className="text-red-600 hover:text-red-800 transition-colors" 
          title="Eliminar Zonal del Panel (no afecta historial)"
        >
          <DeleteIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};

export default DispatchRow;
