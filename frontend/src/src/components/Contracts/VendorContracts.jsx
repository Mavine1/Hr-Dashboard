import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

const VendorContracts = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({
        vendorName: '',
        contractType: '',
        value: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/contracts');
            setContracts(data.contracts || []);
        } catch (error) {
            console.error('Error fetching contracts:', error);
            toast.error('Failed to load contracts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContract) {
                await api.put(`/contracts/${editingContract._id}`, formData);
                toast.success('Contract updated successfully');
            } else {
                await api.post('/contracts', formData);
                toast.success('Contract created successfully');
            }
            setShowModal(false);
            setEditingContract(null);
            resetForm();
            fetchContracts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contract?')) {
            try {
                await api.delete(`/contracts/${id}`);
                toast.success('Contract deleted successfully');
                fetchContracts();
            } catch (error) {
                toast.error('Failed to delete contract');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            vendorName: '',
            contractType: '',
            value: '',
            startDate: '',
            endDate: '',
            description: '',
        });
    };

    const editContract = (contract) => {
        setEditingContract(contract);
        setFormData({
            vendorName: contract.vendorName,
            contractType: contract.contractType,
            value: contract.value,
            startDate: contract.startDate?.split('T')[0] || '',
            endDate: contract.endDate?.split('T')[0] || '',
            description: contract.description || '',
        });
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expiring': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'terminated': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getContractTypeIcon = (type) => {
        switch(type) {
            case 'service': return '🤝';
            case 'supply': return '📦';
            case 'consulting': return '💼';
            case 'software': return '💻';
            case 'maintenance': return '🔧';
            default: return '📄';
        }
    };

    const filteredContracts = contracts.filter(contract => {
        const matchesFilter = filter === 'all' || contract.status === filter;
        const matchesSearch = contract.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              contract.contractId?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: contracts.length,
        active: contracts.filter(c => c.status === 'active').length,
        expiring: contracts.filter(c => c.status === 'expiring').length,
        totalValue: contracts.reduce((sum, c) => sum + (c.value || 0), 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vendor Contracts</h1>
                    <p className="text-gray-600 mt-1">Manage all vendor agreements and contracts</p>
                </div>
                <button 
                    onClick={() => { setEditingContract(null); resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Contract
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Contracts</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active Contracts</p>
                            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Expiring Soon</p>
                            <p className="text-3xl font-bold text-red-600">{stats.expiring}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Value</p>
                            <p className="text-3xl font-bold text-gray-900">Ksh {stats.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contracts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'active' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Active
                        </button>
                        <button 
                            onClick={() => setFilter('expiring')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'expiring' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Expiring
                        </button>
                        <button 
                            onClick={() => setFilter('terminated')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'terminated' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Terminated
                        </button>
                    </div>
                </div>
            </div>

            {/* Contracts List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredContracts.length === 0 ? (
                    <div className="card text-center py-12">
                        <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No contracts found</p>
                    </div>
                ) : (
                    filteredContracts.map((contract) => (
                        <div key={contract._id} className="card hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{getContractTypeIcon(contract.contractType)}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                                            {contract.status.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">{contract.contractId}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{contract.vendorName}</h3>
                                    <p className="text-gray-600 mt-1">{contract.description}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                        <span>📄 {contract.contractType}</span>
                                        <span>💰 Ksh {contract.value?.toLocaleString()}</span>
                                        <span>📅 Start: {new Date(contract.startDate).toLocaleDateString()}</span>
                                        <span>📅 End: {new Date(contract.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => editContract(contract)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(contract._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Contract Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingContract ? 'Edit Contract' : 'Add New Contract'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                                    <input
                                        type="text"
                                        value={formData.vendorName}
                                        onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type *</label>
                                    <select
                                        value={formData.contractType}
                                        onChange={(e) => setFormData({...formData, contractType: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="service">Service Agreement</option>
                                        <option value="supply">Supply Contract</option>
                                        <option value="consulting">Consulting</option>
                                        <option value="software">Software License</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (Ksh)</label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({...formData, value: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 btn-primary">
                                        {editingContract ? 'Update Contract' : 'Add Contract'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => { setShowModal(false); setEditingContract(null); resetForm(); }}
                                        className="flex-1 btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorContracts;