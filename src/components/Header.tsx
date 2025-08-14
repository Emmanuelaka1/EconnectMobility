import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, ChevronDown, Calendar, DollarSign, HelpCircle, Lock, LogOut } from 'lucide-react';

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-gray-300" />
            </button>
          )}
          
          <div className="relative">
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search properties, clients..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-700 border border-gray-600 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Gaston Luga</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">Welcome Gaston!</p>
                </div>
                
                <div className="py-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150">
                    <Calendar className="w-4 h-4" />
                    <span>My Schedules</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150">
                    <DollarSign className="w-4 h-4" />
                    <span>Pricing</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150">
                    <Lock className="w-4 h-4" />
                    <span>Lock screen</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-150">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;