import React from 'react';
import { NavLink } from 'react-router-dom';
import { PanelIcon, HistoryIcon, ReportsIcon, CialLogoIcon } from './icons';

const Sidebar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center py-3 px-4 transition-colors duration-200 hover:bg-green-700 ${
      isActive ? 'bg-green-700 text-white' : 'text-green-100 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-green-800 text-white flex flex-col min-h-screen">
      <div className="flex items-center justify-start h-24 border-b border-green-700 px-4 py-2">
        <CialLogoIcon className="h-16 w-16 mr-3" />
        <div className="text-xl font-semibold text-white">
          Control Despacho
        </div>
      </div>
      <nav className="flex-grow mt-4">
        <NavLink to="/panel-despacho" className={navLinkClasses}>
          <PanelIcon className="h-5 w-5 mr-3" />
          Panel de Despacho
        </NavLink>
        <NavLink to="/historial" className={navLinkClasses}>
          <HistoryIcon className="h-5 w-5 mr-3" />
          Historial
        </NavLink>
        <NavLink to="/reportes" className={navLinkClasses}>
          <ReportsIcon className="h-5 w-5 mr-3" />
          Reportes
        </NavLink>
      </nav>
      <div className="p-4 text-xs text-green-300 text-center">
        CIAL Control v1.0.0
        <p className="mt-1">Persistencia local por navegador. Para sincronización multi-dispositivo, se requiere un backend.</p>
      </div>
    </div>
  );
};

export default Sidebar;