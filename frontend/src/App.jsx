import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import TaskCentre from './components/Tasks/TaskCentre';
import VendorContracts from './components/Contracts/VendorContracts';
import HRLetters from './components/Letters/HRLetters';
import Employees from './components/Employees/Employees';
import FinancialHub from './components/Budget/FinancialHub';
import Training from './components/Training/Training';
import UpcomingEvents from './components/Events/UpcomingEvents';
import CostAnalyzer from './components/CostAnalyzer/CostAnalyzer';
import Settings from './components/Settings/Settings';

// Simple placeholder components for pages not yet created
const VendorContracts = () => <div className="p-6"><h1 className="text-2xl font-bold">Vendor Contracts</h1><p className="mt-4">Coming soon...</p></div>;
const HRLetters = () => <div className="p-6"><h1 className="text-2xl font-bold">HR Letters</h1><p className="mt-4">Coming soon...</p></div>;
const Employees = () => <div className="p-6"><h1 className="text-2xl font-bold">Employees</h1><p className="mt-4">Coming soon...</p></div>;
const FinancialHub = () => <div className="p-6"><h1 className="text-2xl font-bold">Financial Hub</h1><p className="mt-4">Coming soon...</p></div>;
const Training = () => <div className="p-6"><h1 className="text-2xl font-bold">Training</h1><p className="mt-4">Coming soon...</p></div>;
const UpcomingEvents = () => <div className="p-6"><h1 className="text-2xl font-bold">Upcoming Events</h1><p className="mt-4">Coming soon...</p></div>;
const CostAnalyzer = () => <div className="p-6"><h1 className="text-2xl font-bold">Cost Analyzer</h1><p className="mt-4">Coming soon...</p></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4">Coming soon...</p></div>;

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <>
            <Toaster position="top-right" />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/task-centre" element={<TaskCentre />} />
                        <Route path="/vendor-contracts" element={<VendorContracts />} />
                        <Route path="/hr-letters" element={<HRLetters />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/financial-hub" element={<FinancialHub />} />
                        <Route path="/training" element={<Training />} />
                        <Route path="/upcoming-events" element={<UpcomingEvents />} />
                        <Route path="/cost-analyzer" element={<CostAnalyzer />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;