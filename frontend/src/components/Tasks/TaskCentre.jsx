import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

const TaskCentre = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
        estimatedHours: '',
    });
    const [employees, setEmployees] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/tasks');
            setTasks(data.tasks || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const { data } = await api.get('/employees');
            setEmployees(data.employees || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, formData);
                toast.success('Task updated successfully');
            } else {
                await api.post('/tasks', formData);
                toast.success('Task created successfully');
            }
            setShowModal(false);
            setEditingTask(null);
            resetForm();
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                toast.success('Task deleted successfully');
                fetchTasks();
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/tasks/${id}`, { status: newStatus });
            toast.success('Task status updated');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            assignedTo: '',
            priority: 'medium',
            dueDate: '',
            estimatedHours: '',
        });
    };

    const editTask = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo?._id || task.assignedTo,
            priority: task.priority,
            dueDate: task.dueDate?.split('T')[0] || '',
            estimatedHours: task.estimatedHours || '',
        });
        setShowModal(true);
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Task Centre</h1>
                    <p className="text-gray-600 mt-1">Manage and track all tasks across the organization</p>
                </div>
                <button 
                    onClick={() => { setEditingTask(null); resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Task
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Tasks</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <ClockIcon className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">In Progress</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ClockIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
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
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => setFilter('in-progress')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'in-progress' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            In Progress
                        </button>
                        <button 
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="card text-center py-12">
                        <FunnelIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No tasks found</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div key={task._id} className="card hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority.toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                            {task.status.replace('-', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                                    <p className="text-gray-600 mt-1">{task.description}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                        <span>👤 Assigned to: {task.assignedTo?.name || 'Unassigned'}</span>
                                        <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                        {task.estimatedHours && <span>⏱️ {task.estimatedHours} hours</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {task.status !== 'completed' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(task._id, 'completed')}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Mark Complete"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => editTask(task)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(task._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            {task.progress > 0 && task.status !== 'completed' && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Progress</span>
                                        <span>{task.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-primary-600 h-2 rounded-full transition-all"
                                            style={{ width: `${task.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                                    <select
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                                    <input
                                        type="number"
                                        value={formData.estimatedHours}
                                        onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g., 8"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 btn-primary">
                                        {editingTask ? 'Update Task' : 'Create Task'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => { setShowModal(false); setEditingTask(null); resetForm(); }}
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

export default TaskCentre;