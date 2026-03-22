import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            
            <main className="lg:ml-64 pt-16">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;