import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    AcademicCapIcon,
    CalendarIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    EnvelopeIcon,
    StarIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
        { path: '/task-centre', name: 'Task Centre', icon: ClipboardDocumentListIcon },
        { path: '/training', name: 'Training', icon: AcademicCapIcon },
        { path: '/vendor-contracts', name: 'Contracts', icon: DocumentTextIcon },
        { path: '/hr-letters', name: 'HR Letters', icon: EnvelopeIcon },
        { path: '/upcoming-events', name: 'Events', icon: CalendarIcon },
        { path: '/cost-analyzer', name: 'Cost Analyzer', icon: ChartBarIcon },
        { path: '/financial-hub', name: 'Financial Hub', icon: StarIcon },
        { path: '/employees', name: 'Employees', icon: UserGroupIcon },
        { path: '/settings', name: 'Settings', icon: Cog6ToothIcon },
    ];

    const sidebarClasses = `fixed top-16 left-0 h-full bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 w-64`;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            <aside className={sidebarClasses}>
                <nav className="flex flex-col h-full">
                    <div className="flex-1 py-6">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                                onClick={() => onClose()}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* User Profile Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-semibold">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;