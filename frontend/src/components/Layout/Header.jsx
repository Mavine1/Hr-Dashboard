import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    Bars3Icon, 
    BellIcon, 
    UserCircleIcon,
    ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Logo and Menu Button */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                    >
                        <Bars3Icon className="w-6 h-6 text-gray-600" />
                    </button>
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <span className="font-bold text-xl text-gray-800 hidden sm:block">
                            HR<span className="text-primary-600">Admin</span> Pro
                        </span>
                    </Link>
                </div>

                {/* Animated Title (Desktop) */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-50 px-4 py-1 rounded-full border border-primary-200">
                        <p className="text-sm text-primary-700 font-medium animate-pulse">
                            Secure HR & Admin Management System
                        </p>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                        >
                            <BellIcon className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-3 border-b border-gray-200">
                                    <h3 className="font-semibold">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                        <p className="text-sm font-medium">New task assigned</p>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                    <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                        <p className="text-sm font-medium">Contract expiring soon</p>
                                        <p className="text-xs text-gray-500">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Employee'}</p>
                        </div>
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <UserCircleIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Logout"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;