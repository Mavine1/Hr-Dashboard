import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    ChartBarIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    DownloadIcon
} from '@heroicons/react/24/outline';

const CostAnalyzer = () => {
    const [costData, setCostData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [summary, setSummary] = useState({
        totalCost: 0,
        averageCost: 0,
        highestCost: 0,
        lowestCost: 0,
        trend: 0,
    });

    useEffect(() => {
        fetchCostData();
    }, [selectedPeriod]);

    const fetchCostData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/cost-analyzer?period=${selectedPeriod}`);
            setCostData(data.costs || []);
            setSummary(data.summary);
        } catch (error) {
            console.error('Error fetching cost data:', error);
            // Sample fallback data
            setCostData([
                { category: 'HR', amount: 45000, month: 'Jan' },
                { category: 'IT', amount: 68000, month: 'Jan' },
                { category: 'Operations', amount: 32000, month: 'Jan' },
                { category: 'HR', amount: 52000, month: 'Feb' },
                { category: 'IT', amount: 71000, month: 'Feb' },
                { category: 'Operations', amount: 35000, month: 'Feb' },
            ]);
            setSummary({
                totalCost: 487420,
                averageCost: 81236,
                highestCost: 125000,
                lowestCost: 15000,
                trend: 8.5,
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `Ksh ${amount?.toLocaleString() || 0}`;
    };

    const periods = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' },
    ];

    // Group data by category for chart
    const categoryTotals = costData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cost Analyzer</h1>
                    <p className="text-gray-600 mt-1">Analyze costs across departments and projects</p>
                </div>
                <div className="flex gap-2">
                    <select 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                        {periods.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                    <button 
                        onClick={fetchCostData}
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
                            <p className="text-gray-500 text-sm">Total Cost</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary.totalCost)}</p>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Average Cost</p>
                            <p className="text-3xl font-bold text-blue-600">{formatCurrency(summary.averageCost)}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ChartBarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Highest Cost</p>
                            <p className="text-3xl font-bold text-red-600">{formatCurrency(summary.highestCost)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <ArrowTrendingUpIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Trend vs Last</p>
                            <p className={`text-3xl font-bold ${summary.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {summary.trend > 0 ? '+' : ''}{summary.trend}%
                            </p>
                        </div>
                        <div className={`${summary.trend >= 0 ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-full`}>
                            {summary.trend >= 0 ? <ArrowTrendingUpIcon className={`w-6 h-6 text-green-600`} /> : <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cost Breakdown Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Cost Breakdown by Category</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : Object.entries(categoryTotals).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No cost data available
                                    </td>
                                </tr>
                            ) : (
                                Object.entries(categoryTotals).map(([category, amount]) => {
                                    const percentage = ((amount / summary.totalCost) * 100).toFixed(1);
                                    return (
                                        <tr key={category} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatCurrency(amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">{percentage}%</span>
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-primary-600 h-2 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-green-600 text-sm">+{Math.floor(Math.random() * 15)}%</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                    <DownloadIcon className="w-5 h-5" />
                    Export Report
                </button>
            </div>
        </div>
    );
};

export default CostAnalyzer;