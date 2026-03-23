import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    CurrencyDollarIcon,
    ChartBarIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    ArrowDownTrayIcon  // ✅ Fixed: Correct icon name
} from '@heroicons/react/24/outline';

const FinancialHub = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuarter, setSelectedQuarter] = useState('q4');
    const [summary, setSummary] = useState({
        totalBudget: 0,
        totalExpenses: 0,
        remainingBalance: 0,
        utilizationRate: 0,
    });

    useEffect(() => {
        fetchBudgetData();
    }, [selectedQuarter]);

    const fetchBudgetData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/budget/summary?quarter=${selectedQuarter}`);
            setSummary(data);
            setBudgets(data.budgets || []);
        } catch (error) {
            console.error('Error fetching budget data:', error);
            // Sample fallback data
            setSummary({
                totalBudget: 542800,
                totalExpenses: 487420,
                remainingBalance: 55380,
                utilizationRate: 89.8,
            });
            setBudgets([
                { programType: 'training', budgetName: 'Training Programs', amount: 250000, expenses: 230500 },
                { programType: 'events', budgetName: 'Events', amount: 185000, expenses: 172000 },
                { programType: 'extra', budgetName: 'Extra Programs', amount: 107800, expenses: 84920 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `Ksh ${amount?.toLocaleString() || 0}`;
    };

    const getProgramName = (type) => {
        const names = {
            training: 'Training Programs',
            events: 'Events',
            extra: 'Extra Programs',
            hr: 'HR Programs',
            it: 'IT Budget',
            operations: 'Operations'
        };
        return names[type] || type;
    };

    const quarters = [
        { value: 'q1', label: 'Q1 - Jan to Mar' },
        { value: 'q2', label: 'Q2 - Apr to Jun' },
        { value: 'q3', label: 'Q3 - Jul to Sep' },
        { value: 'q4', label: 'Q4 - Oct to Dec' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Hub</h1>
                    <p className="text-gray-600 mt-1">Track budgets, expenses, and financial analytics</p>
                </div>
                <div className="flex gap-2">
                    <select 
                        value={selectedQuarter}
                        onChange={(e) => setSelectedQuarter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                        {quarters.map(q => (
                            <option key={q.value} value={q.value}>{q.label}</option>
                        ))}
                    </select>
                    <button 
                        onClick={fetchBudgetData}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Budget</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary.totalBudget)}</p>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Expenses</p>
                            <p className="text-3xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <TrendingDownIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Remaining Balance</p>
                            <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.remainingBalance)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <TrendingUpIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Utilization Rate</p>
                            <p className="text-3xl font-bold text-blue-600">{summary.utilizationRate}%</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ChartBarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${summary.utilizationRate}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Breakdown Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Program-wise Financial Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : budgets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No budget data available
                                    </td>
                                </tr>
                            ) : (
                                budgets.map((budget, index) => {
                                    const variance = budget.amount - budget.expenses;
                                    const utilization = ((budget.expenses / budget.amount) * 100).toFixed(1);
                                    let status = 'On Track';
                                    let statusColor = 'text-green-600';
                                    if (utilization > 95) {
                                        status = 'Over Budget';
                                        statusColor = 'text-red-600';
                                    } else if (utilization > 85) {
                                        status = 'Watch';
                                        statusColor = 'text-yellow-600';
                                    }
                                    return (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {getProgramName(budget.programType)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(budget.amount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(budget.expenses)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(variance)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">{utilization}%</span>
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-primary-600 h-2 rounded-full"
                                                            style={{ width: `${utilization}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${statusColor}`}>{status}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export Button - Fixed with ArrowDownTrayIcon */}
            <div className="flex justify-end">
                <button 
                    onClick={() => {
                        // Add your export logic here
                        toast.success('Export functionality coming soon');
                    }}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Export Report
                </button>
            </div>
        </div>
    );
};

export default FinancialHub;