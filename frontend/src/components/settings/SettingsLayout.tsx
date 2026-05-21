import React from 'react';
import SettingsSidebar from './SettingsSidebar';
import { Outlet } from 'react-router-dom';

const SettingsLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 p-6">
      <SettingsSidebar />
      <main className="flex-1 ml-8 p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
