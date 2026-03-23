import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    PlusIcon, 
    MagnifyingGlassIcon,
    CalendarIcon,
    MapPinIcon,
    UsersIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'meeting',
        startDate: '',
        endDate: '',
        location: '',
        capacity: '',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/events');
            setEvents(data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            // Sample fallback data
            setEvents([
                { _id: '1', title: 'Annual Conference', description: 'Yearly company conference', type: 'conference', startDate: '2024-12-20', endDate: '2024-12-22', location: 'Convention Center', capacity: 200, attendees: 145, status: 'upcoming' },
                { _id: '2', title: 'Team Building', description: 'Quarterly team building event', type: 'team-building', startDate: '2024-12-15', endDate: '2024-12-15', location: 'Park', capacity: 50, attendees: 38, status: 'upcoming' },
                { _id: '3', title: 'Town Hall', description: 'Company-wide town hall meeting', type: 'meeting', startDate: '2024-12-10', endDate: '2024-12-10', location: 'Auditorium', capacity: 300, attendees: 210, status: 'ongoing' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent._id}`, formData);
                toast.success('Event updated successfully');
            } else {
                await api.post('/events', formData);
                toast.success('Event created successfully');
            }
            setShowModal(false);
            setEditingEvent(null);
            resetForm();
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                toast.success('Event deleted successfully');
                fetchEvents();
            } catch (error) {
                toast.error('Failed to delete event');
            }
        }
    };

    const handleRSVP = async (id) => {
        try {
            await api.post(`/events/${id}/rsvp`);
            toast.success('RSVP confirmed!');
            fetchEvents();
        } catch (error) {
            toast.error('Failed to RSVP');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'meeting',
            startDate: '',
            endDate: '',
            location: '',
            capacity: '',
        });
    };

    const editEvent = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            type: event.type,
            startDate: event.startDate?.split('T')[0] || '',
            endDate: event.endDate?.split('T')[0] || '',
            location: event.location || '',
            capacity: event.capacity || '',
        });
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEventIcon = (type) => {
        const icons = {
            meeting: '🤝',
            workshop: '🔧',
            conference: '🎤',
            'team-building': '🎯',
            social: '🎉',
            other: '📌'
        };
        return icons[type] || '📅';
    };

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'all' || event.status === filter;
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              event.location?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: events.length,
        upcoming: events.filter(e => e.status === 'upcoming').length,
        ongoing: events.filter(e => e.status === 'ongoing').length,
        totalAttendees: events.reduce((sum, e) => sum + (e.attendees || 0), 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
                    <p className="text-gray-600 mt-1">View and manage company events and activities</p>
                </div>
                <button 
                    onClick={() => { setEditingEvent(null); resetForm(); setShowModal(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Event
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Events</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <CalendarIcon className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Upcoming</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ClockIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Ongoing</p>
                            <p className="text-3xl font-bold text-green-600">{stats.ongoing}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Attendees</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.totalAttendees}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <UsersIcon className="w-6 h-6 text-purple-600" />
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
                            placeholder="Search events..."
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
                            onClick={() => setFilter('upcoming')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'upcoming' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Upcoming
                        </button>
                        <button 
                            onClick={() => setFilter('ongoing')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'ongoing' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Ongoing
                        </button>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No events found</p>
                    </div>
                ) : (
                    filteredEvents.map((event) => (
                        <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{getEventIcon(event.type)}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                            {event.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => editEvent(event)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(event._id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{new Date(event.startDate).toLocaleDateString()} {event.startDate !== event.endDate ? `- ${new Date(event.endDate).toLocaleDateString()}` : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPinIcon className="w-4 h-4" />
                                        <span>{event.location || 'Location TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <UsersIcon className="w-4 h-4" />
                                        <span>Attendees: {event.attendees || 0}/{event.capacity || 'Unlimited'}</span>
                                    </div>
                                </div>
                                {event.status !== 'completed' && (
                                    <button 
                                        onClick={() => handleRSVP(event._id)}
                                        className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                    >
                                        RSVP
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="meeting">Meeting</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="conference">Conference</option>
                                        <option value="team-building">Team Building</option>
                                        <option value="social">Social</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
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
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Venue or online link"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Maximum attendees"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700">
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => { setShowModal(false); setEditingEvent(null); resetForm(); }}
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

export default UpcomingEvents;