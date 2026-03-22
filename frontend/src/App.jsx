import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
// import TaskCentre from './components/Tasks/TaskCentre';
// import VendorContracts from './components/Contracts/VendorContracts';
// import HRLetters from './components/Letters/HRLetters';
// import Employees from './components/Employees/Employees';
// import FinancialHub from './components/Budget/FinancialHub';
// import Training from './components/Training/Training';
// import UpcomingEvents from './components/Events/UpcomingEvents';
// import CostAnalyzer from './components/CostAnalyzer/CostAnalyzer';
// import Settings from './components/Settings/Settings';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/task-centre" element={<TaskCentre />} />
                <Route path="/vendor-contracts" element={<VendorContracts />} /> */}
                {/* <Route path="/hr-letters" element={<HRLetters />} /> */}
                {/* <Route path="/employees" element={<Employees />} />
                <Route path="/financial-hub" element={<FinancialHub />} />
                <Route path="/training" element={<Training />} />
                <Route path="/upcoming-events" element={<UpcomingEvents />} />
                <Route path="/cost-analyzer" element={<CostAnalyzer />} />
                <Route path="/settings" element={<Settings />} /> */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
}

function App() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
                <Toaster position="top-right" />
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;