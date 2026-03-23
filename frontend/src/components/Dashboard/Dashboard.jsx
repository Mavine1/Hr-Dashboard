import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    UsersIcon, 
    ClipboardDocumentListIcon, 
    CurrencyDollarIcon, 
    CalendarIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 156,
        totalTasks: 24,
        totalContracts: 18,
        totalEvents: 8,
        taskCompletionRate: 85,
        budgetUtilization: 72,
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch real data from API
            const [tasksRes, contractsRes, eventsRes] = await Promise.all([
                api.get('/tasks/stats').catch(() => ({ data: { stats: {} } })),
                api.get('/contracts/stats').catch(() => ({ data: { stats: {} } })),
                api.get('/events').catch(() => ({ data: [] })),
            ]);
            
            setStats({
                totalEmployees: 156,
                totalTasks: tasksRes.data.stats?.total || 24,
                totalContracts: contractsRes.data.stats?.total || 18,
                totalEvents: eventsRes.data?.length || 8,
                taskCompletionRate: tasksRes.data.stats?.completionRate || 85,
                budgetUtilization: 72,
            });
            
            setRecentActivities([
                { id: 1, type: 'task', title: 'New task assigned', description: 'System Update', time: '5 minutes ago', icon: '📋', user: 'Admin' },
                { id: 2, type: 'contract', title: 'Contract expiring', description: 'ABC Supplies Contract', time: '1 hour ago', icon: '📄', user: 'System' },
                { id: 3, type: 'employee', title: 'New employee joined', description: 'Sarah Johnson - Developer', time: '2 hours ago', icon: '👤', user: 'HR' },
                { id: 4, type: 'training', title: 'Training scheduled', description: 'Leadership Workshop', time: '5 hours ago', icon: '🎓', user: 'Manager' },
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        { title: 'Total Employees', value: stats.totalEmployees, icon: UsersIcon, color: 'bg-primary-600', change: '+12%', trend: 'up' },
        { title: 'Active Tasks', value: stats.totalTasks, icon: ClipboardDocumentListIcon, color: 'bg-blue-500', change: '+8%', trend: 'up' },
        { title: 'Active Contracts', value: stats.totalContracts, icon: DocumentTextIcon, color: 'bg-green-500', change: '+5%', trend: 'up' },
        { title: 'Upcoming Events', value: stats.totalEvents, icon: CalendarIcon, color: 'bg-yellow-500', change: '+2', trend: 'up' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
                </h1>
                <p className="text-primary-100">
                    Here's what's happening with your HR dashboard today.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div className={`${stat.color} p-3 rounded-xl`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Completion Rate */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Task Completion Rate</h3>
                    <div className="relative pt-4">
                        <div className="flex items-center justify-center">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="#1e40af"
                                        strokeWidth="10"
                                        strokeDasharray={`${stats.taskCompletionRate * 2.83} 283`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-primary-600">{stats.taskCompletionRate}%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-gray-500 mt-4">Overall completion rate this month</p>
                    </div>
                </div>

                {/* Budget Utilization */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Budget Utilization</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Q4 Budget</span>
                                <span>{stats.budgetUtilization}% Used</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.budgetUtilization}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Total Budget</p>
                                <p className="text-xl font-bold text-gray-900">Ksh 542,800</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Remaining</p>
                                <p className="text-xl font-bold text-green-600">Ksh 115,380</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                    <button className="text-primary-600 text-sm hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.description}</p>
                                <p className="text-xs text-gray-400 mt-1">by {activity.user} • {activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserPlusIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="font-medium">Add Employee</p>
                </button>
                <button className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ClipboardDocumentListIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="font-medium">Create Task</p>
                </button>
                <button className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="font-medium">New Contract</p>
                </button>
                <button className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ChartBarIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="font-medium">Generate Report</p>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;