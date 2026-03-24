import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Bars3Icon, 
    BellIcon, 
    UserCircleIcon,
    ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Header = ({ toggleSidebar }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin User","role":"admin"}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        window.location.href = '/login';
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="flex items-center justify-between px-6 py-3">
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

                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-50 px-4 py-1 rounded-full border border-primary-200">
                        <p className="text-sm text-primary-700 font-medium animate-pulse">
                            Secure HR & Admin Management System
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
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
                                        <p className="text-sm font-medium">Welcome to HR Admin Pro!</p>
                                        <p className="text-xs text-gray-500">Just now</p>
                                    </div>
                                    <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                        <p className="text-sm font-medium">3 tasks pending</p>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

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