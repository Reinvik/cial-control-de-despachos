
import React, { useState, useEffect } from 'react';
import { DispatchZone } from '../types';
import { XMarkIcon, ClockIconOutline } from './icons';

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: DispatchZone | Omit<DispatchZone, 'id' | 'isActive'>) => void;
  existingZone?: DispatchZone | null;
}

const AddZoneModal: React.FC<AddZoneModalProps> = ({ isOpen, onClose, onSave, existingZone }) => {
  const [name, setName] = useState('');
  const [targetTime, setTargetTime] = useState(''); // HH:MM

  useEffect(() => {
    if (existingZone) {
      setName(existingZone.name);
      setTargetTime(existingZone.targetTime);
    } else {
      setName('');
      setTargetTime('');
    }
  }, [existingZone, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetTime) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    if (existingZone) {
      onSave({ ...existingZone, name, targetTime });
    } else {
      onSave({ name, targetTime });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {existingZone ? 'Editar Zonal de Despacho' : 'Agregar Nueva Zonal de Despacho'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          {existingZone ? 'Modifica los detalles de la zonal.' : 'Ingresa los detalles para la nueva zonal de despacho.'} Haz clic en guardar cuando termines.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="zonalName" className="block text-sm font-medium text-gray-700 mb-1">Zonal</label>
            <input
              type="text"
              id="zonalName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sector Norte"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="targetTime" className="block text-sm font-medium text-gray-700 mb-1">Hora Objetivo</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIconOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                type="time"
                id="targetTime"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none"
                required
                />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {existingZone ? 'Guardar Cambios' : 'Guardar Despacho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddZoneModal;
