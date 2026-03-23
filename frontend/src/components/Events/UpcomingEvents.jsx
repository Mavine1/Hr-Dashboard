import React from 'react';

const UpcomingEvents = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
                <p className="text-gray-600 mt-1">View and manage company events and activities</p>
            </div>
            <div className="card text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2">Event Calendar</h3>
                <p className="text-gray-500">Coming soon! This feature is under development.</p>
            </div>
        </div>
    );
};

export default UpcomingEvents;