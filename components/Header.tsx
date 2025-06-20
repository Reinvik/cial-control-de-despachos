
import React from 'react';

interface HeaderProps {
  currentTime: Date;
}

const Header: React.FC<HeaderProps> = ({ currentTime }) => {
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    let formatted = date.toLocaleDateString('es-ES', options);
    // Capitalize first letter
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return formatted;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="bg-white shadow-md p-4 h-20 flex items-center">
      <h1 className="text-2xl font-semibold text-gray-700">
        {formatDate(currentTime)} ({formatTime(currentTime)})
      </h1>
    </header>
  );
};

export default Header;
