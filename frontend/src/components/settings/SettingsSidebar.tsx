import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Palette, Brain, Link as LinkIcon, Bell, Shield, Accessibility, FlaskConical, AlertTriangle } from 'lucide-react';

const menuItems = [
  { name: 'Profile', icon: User, path: '/settings/profile' },
  { name: 'Appearance', icon: Palette, path: '/settings/appearance' },
  { name: 'Productivity', icon: Brain, path: '/settings/productivity' },
  { name: 'Integrations', icon: LinkIcon, path: '/settings/integrations' },
  { name: 'Notifications', icon: Bell, path: '/settings/notifications' },
  { name: 'Security', icon: Shield, path: '/settings/security' },
  { name: 'Accessibility', icon: Accessibility, path: '/settings/accessibility' },
  { name: 'Labs', icon: FlaskConical, path: '/settings/labs' },
  { name: 'Danger Zone', icon: AlertTriangle, path: '/settings/danger' },
];

const SettingsSidebar: React.FC = () => {
  return (
    <aside className="w-64 flex flex-col gap-2">
      <h2 className="text-xl font-bold mb-6 px-4">Settings</h2>
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          <item.icon size={20} />
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
};

export default SettingsSidebar;
