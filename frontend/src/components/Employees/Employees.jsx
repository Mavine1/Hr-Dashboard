import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    UserGroupIcon,
    UserPlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        employmentType: 'full-time',
        dateOfJoining: '',
        salary: '',
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/employees');
            setEmployees(data.employees || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Sample fallback data
            setEmployees([
                { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '+254 712 345 678', department: 'IT', position: 'Senior Developer', employmentType: 'full-time', status: 'active', dateOfJoining: '2023-01-15', salary: 85000 },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+254 723 456 789', department: 'HR', position: 'HR Manager', employmentType: 'full-time', status: 'active', dateOfJoining: '2022-06-01', salary: 95000 },
                { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '+254 734 567 890', department: 'Sales', position: 'Sales Executive', employmentType: 'full-time', status: 'active', dateOfJoining: '2023-03-20', salary: 65000 },
                { _id: '4', name: 'Sarah Williams', email: 'sarah@example.com', phone: '+254 745 678 901', department: 'Marketing', position: 'Marketing Specialist', employmentType: 'full-time', status: 'probation', dateOfJoining: '2023-11-01', salary: 70000 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                await api.put(`/employees/${editingEmployee._id}`, formData);
                toast.success('Employee updated successfully');
            } else {
                await api.post('/employees', formData);
                toast.success('Employee added successfully');
            }
            setShowModal(false);
            setEditingEmployee(null);
            resetForm();
            fetchEmployees();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/employees/${id}`);
                toast.success('Employee deleted successfully');
                fetchEmployees();
            } catch (error) {
                toast.error('Failed to delete employee');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            department: '',
            position: '',
            employmentType: 'full-time',
            dateOfJoining: '',
            salary: '',
        });
    };

    const editEmployee = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            name: employee.name,
            email: employee.email,
            phone: employee.phone || '',
            department: employee.department,
            position: employee.position,
            employmentType: employee.employmentType || 'full-time',
            dateOfJoining: employee.dateOfJoining?.split('T')[0] || '',
            salary: employee.salary || '',
        });
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'probation': return 'bg-yellow-100 text-yellow-800';
            case 'terminated': return 'bg-red-100 text-red-800';
            case 'resigned': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesFilter = filter === 'all' || emp.status === filter;
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              emp.department.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: employees.length,
        active: employees.filter(e => e.status === 'active').length,
        probation: employees.filter(e => e.status === 'probation').length,
        departments: [...new Set(employees.map(e => e.department))].length,
    };

    const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                    <p className="text-gray-600 mt-1">Manage employee records and profiles</p>
                </div>
                <button 
                    onClick={() => { setEditingEmployee(null); resetForm(); setShowModal(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    <UserPlusIcon className="w-5 h-5" />
                    Add Employee
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Employees</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <UserGroupIcon className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active</p>
                            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <UserGroupIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">On Probation</p>
                            <p className="text-3xl font-bold text-yellow-600">{stats.probation}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <ClockIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Departments</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.departments}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
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
                            onClick={() => setFilter('probation')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'probation' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Probation
                        </button>
                    </div>
                </div>
            </div>

            {/* Employees Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No employees found</p>
                    </div>
                ) : (
                    filteredEmployees.map((employee) => (
                        <div key={employee._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                                            {employee.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                                            <p className="text-sm text-gray-500">{employee.position}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                        {employee.status?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <EnvelopeIcon className="w-4 h-4" />
                                        <span>{employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>{employee.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <BuildingOfficeIcon className="w-4 h-4" />
                                        <span>{employee.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <BriefcaseIcon className="w-4 h-4" />
                                        <span>{employee.employmentType}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>Joined: {new Date(employee.dateOfJoining).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                    <button 
                                        onClick={() => editEmployee(employee)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(employee._id)}
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

            {/* Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select
                                            value={formData.department}
                                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">Select</option>
                                            {departments.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                        <input
                                            type="text"
                                            value={formData.position}
                                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                        <select
                                            value={formData.employmentType}
                                            onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="full-time">Full Time</option>
                                            <option value="part-time">Part Time</option>
                                            <option value="contract">Contract</option>
                                            <option value="intern">Intern</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                                        <input
                                            type="date"
                                            value={formData.dateOfJoining}
                                            onChange={(e) => setFormData({...formData, dateOfJoining: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Ksh)</label>
                                    <input
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g., 50000"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700">
                                        {editingEmployee ? 'Update Employee' : 'Add Employee'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => { setShowModal(false); setEditingEmployee(null); resetForm(); }}
                                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
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

export default Employees;