import React, { useMemo } from 'react';
import { HistoryEntry } from '../types';
import { DownloadIcon, HistoryTableIcon, TrendingUpIcon } from './icons'; // Added TrendingUpIcon

interface HistoryPageProps {
  history: HistoryEntry[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history }) => {
  const downloadHistoryAsCSV = () => {
    if (history.length === 0) {
        alert("No hay datos en el historial para descargar.");
        return;
    }
    const headers = ["ID", "Zonal de Despacho", "Fecha", "Hora Registrada (Contador)", "Hora Objetivo", "Hora Guardado"];
    const csvRows = [
      headers.join(','),
      ...history.map(entry => 
        [
          entry.id,
          `"${entry.zonalName.replace(/"/g, '""')}"`, // Escape quotes
          entry.date,
          entry.registeredTime,
          entry.targetTime,
          entry.savedTime
        ].join(',')
      )
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'historial_despachos_cial.csv'); // Added CIAL to filename
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const { onTimePercentage, onTimeCount, lateCount, totalCount } = useMemo(() => {
    if (history.length === 0) {
      return { onTimePercentage: 0, onTimeCount: 0, lateCount: 0, totalCount: 0 };
    }
    const onTimeEntries = history.filter(
      (entry) => entry.registeredTime !== "00:00:00" && entry.registeredTime !== "" // Ensure empty string is not counted as on-time
    ).length;
    const calculatedPercentage = (onTimeEntries / history.length) * 100;
    return {
      onTimePercentage: parseFloat(calculatedPercentage.toFixed(1)),
      onTimeCount: onTimeEntries,
      lateCount: history.length - onTimeEntries,
      totalCount: history.length
    };
  }, [history]);

  return (
    <>
      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                <TrendingUpIcon className="h-6 w-6 mr-2 text-green-600" />
                KPI: Salidas a Tiempo
            </h3>
        </div>
        
        {totalCount > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-1 text-center md:text-left">
                        <p className="text-4xl font-bold text-green-600">
                            {onTimePercentage}%
                        </p>
                        <p className="text-sm text-gray-600">
                            Cumplimiento de Horarios
                        </p>
                    </div>
                    <div className="md:col-span-2 flex flex-col space-y-1 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Despachos Totales:</span>
                            <span className="font-semibold text-gray-800">{totalCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-green-600">A Tiempo:</span>
                            <span className="font-semibold text-green-600">{onTimeCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-red-600">Retrasados:</span>
                            <span className="font-semibold text-red-600">{lateCount}</span>
                        </div>
                    </div>
                </div>
                 <p className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-200">
                    Un despacho se considera "a tiempo" si se guarda en el historial antes de que su contador de tiempo restante llegue a <code className="bg-gray-100 px-1 rounded">00:00:00</code>.
                </p>
            </>
        ) : (
            <p className="text-gray-500 text-center py-4">No hay datos históricos suficientes para calcular el KPI.</p>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Historial de Despachos</h2>
          <button
            onClick={downloadHistoryAsCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-colors"
            disabled={history.length === 0}
            aria-label="Descargar Historial en formato CSV"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Descargar Historial (CSV)
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          <HistoryTableIcon className="h-5 w-5 mr-2 inline-block align-text-bottom" />
          Vista previa del historial de despachos. A continuación se muestra una vista previa de los datos que se incluirán en el archivo CSV.
        </p>
        <div className="overflow-x-auto table-scrollbar max-h-[calc(60vh-80px)]"> {/* Adjusted max-h for KPI card */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zonal de Despacho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Registrada (Contador)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Objetivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Guardado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    El historial de despachos está vacío.
                  </td>
                </tr>
              )}
              {history.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.zonalName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.registeredTime || '--:--:--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.targetTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.savedTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={entry.id}>{entry.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;