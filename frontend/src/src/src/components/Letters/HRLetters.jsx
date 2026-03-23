import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    EnvelopeIcon,
    DocumentTextIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const HRLetters = () => {
    const [letters, setLetters] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLetter, setEditingLetter] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({
        letterType: '',
        subject: '',
        content: '',
        employee: '',
    });

    const letterTemplates = {
        appointment: `Dear {employee_name},

We are pleased to offer you the position of {position} at our company, effective {date}.

Your appointment details and compensation package will be provided separately.

Sincerely,
HR Department`,
        promotion: `Dear {employee_name},

Congratulations! We are pleased to promote you to the position of {position}, effective {date}.

This promotion is in recognition of your exceptional performance.

Best regards,
HR Department`,
        warning: `Dear {employee_name},

This letter serves as an official warning regarding your recent conduct/performance.

You are expected to improve immediately.

Sincerely,
HR Department`,
        termination: `Dear {employee_name},

This letter is to inform you that your employment with our company will be terminated effective {date}.

Sincerely,
HR Department`,
        experience: `To Whom It May Concern,

This is to certify that {employee_name} worked with our organization from {start_date} to {end_date} in the capacity of {position}.

We wish {employee_name} all the best in future endeavors.

Sincerely,
HR Department`,
        salary: `Dear {employee_name},

We are pleased to inform you that your salary has been revised effective {date}.

Your new monthly salary will be {salary}.

Sincerely,
HR Department`
    };

    useEffect(() => {
        fetchLetters();
        fetchEmployees();
    }, []);

    const fetchLetters = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/letters');
            setLetters(data.letters || []);
        } catch (error) {
            console.error('Error fetching letters:', error);
            toast.error('Failed to load letters');
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

    const handleLetterTypeChange = (type) => {
        setFormData({
            ...formData,
            letterType: type,
            content: letterTemplates[type] || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLetter) {
                await api.put(`/letters/${editingLetter._id}`, formData);
                toast.success('Letter updated successfully');
            } else {
                await api.post('/letters', formData);
                toast.success('Letter created successfully');
            }
            setShowModal(false);
            setEditingLetter(null);
            resetForm();
            fetchLetters();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleSend = async (id) => {
        try {
            await api.put(`/letters/${id}`, { status: 'sent' });
            toast.success('Letter sent successfully');
            fetchLetters();
        } catch (error) {
            toast.error('Failed to send letter');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this letter?')) {
            try {
                await api.delete(`/letters/${id}`);
                toast.success('Letter deleted successfully');
                fetchLetters();
            } catch (error) {
                toast.error('Failed to delete letter');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            letterType: '',
            subject: '',
            content: '',
            employee: '',
        });
    };

    const editLetter = (letter) => {
        setEditingLetter(letter);
        setFormData({
            letterType: letter.letterType,
            subject: letter.subject,
            content: letter.content,
            employee: letter.employee?._id || letter.employee,
        });
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'sent': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLetterTypeName = (type) => {
        const types = {
            appointment: 'Appointment Letter',
            promotion: 'Promotion Letter',
            warning: 'Warning Letter',
            termination: 'Termination Letter',
            experience: 'Experience Letter',
            salary: 'Salary Revision',
            custom: 'Custom Letter'
        };
        return types[type] || type;
    };

    const filteredLetters = letters.filter(letter => {
        const matchesFilter = filter === 'all' || letter.status === filter;
        const matchesSearch = letter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              letter.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: letters.length,
        sent: letters.filter(l => l.status === 'sent').length,
        draft: letters.filter(l => l.status === 'draft').length,
        pending: letters.filter(l => l.status === 'pending').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">HR Letters</h1>
                    <p className="text-gray-600 mt-1">Create and manage HR communication letters</p>
                </div>
                <button 
                    onClick={() => { setEditingLetter(null); resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Letter
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Letters</p>
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
                            <p className="text-gray-500 text-sm">Sent</p>
                            <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <PaperAirplaneIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Drafts</p>
                            <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <PencilIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ClockIcon className="w-6 h-6 text-blue-600" />
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
                            placeholder="Search letters..."
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
                            onClick={() => setFilter('sent')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'sent' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Sent
                        </button>
                        <button 
                            onClick={() => setFilter('draft')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'draft' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Drafts
                        </button>
                    </div>
                </div>
            </div>

            {/* Letters List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredLetters.length === 0 ? (
                    <div className="card text-center py-12">
                        <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No letters found</p>
                    </div>
                ) : (
                    filteredLetters.map((letter) => (
                        <div key={letter._id} className="card hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(letter.status)}`}>
                                            {letter.status.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">{letter.referenceNumber}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{letter.subject}</h3>
                                    <p className="text-gray-600 mt-1 line-clamp-2">{letter.content}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                        <span>📄 {getLetterTypeName(letter.letterType)}</span>
                                        <span>👤 To: {letter.employee?.name || 'Unknown'}</span>
                                        <span>📅 {new Date(letter.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {letter.status !== 'sent' && (
                                        <button 
                                            onClick={() => handleSend(letter._id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Send"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => editLetter(letter)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(letter._id)}
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

            {/* Letter Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingLetter ? 'Edit Letter' : 'Create New Letter'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Letter Type *</label>
                                    <select
                                        value={formData.letterType}
                                        onChange={(e) => handleLetterTypeChange(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="appointment">Appointment Letter</option>
                                        <option value="promotion">Promotion Letter</option>
                                        <option value="warning">Warning Letter</option>
                                        <option value="termination">Termination Letter</option>
                                        <option value="experience">Experience Letter</option>
                                        <option value="salary">Salary Revision</option>
                                        <option value="custom">Custom Letter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Employee *</label>
                                    <select
                                        value={formData.employee}
                                        onChange={(e) => setFormData({...formData, employee: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.name} - {emp.department}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        rows="12"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tip: Use {'{employee_name}'}, {'{position}'}, {'{date}'}, {'{salary}'} as placeholders
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 btn-primary">
                                        {editingLetter ? 'Update Letter' : 'Create Letter'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => { setShowModal(false); setEditingLetter(null); resetForm(); }}
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

export default HRLetters;