import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
    UserCircleIcon,
    BellIcon,
    PaintBrushIcon,
    ShieldCheckIcon,
    LanguageIcon,
    Cog6ToothIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        position: user?.position || '',
        phone: user?.phone || '',
    });
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        taskReminders: true,
        contractAlerts: true,
        weeklyDigest: false,
    });
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: 'light',
        sidebarCollapsed: false,
        animations: true,
        fontSize: 'medium',
    });
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        loginNotifications: true,
        sessionTimeout: 60,
    });
    const [preferences, setPreferences] = useState({
        language: 'en',
        timezone: 'Africa/Nairobi',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await updateProfile(profileForm);
        setLoading(false);
        if (result.success) {
            toast.success('Profile updated successfully');
        }
    };

    const saveNotificationSettings = () => {
        // Save to localStorage or API
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
        toast.success('Notification settings saved');
    };

    const saveAppearanceSettings = () => {
        localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));
        // Apply theme
        if (appearanceSettings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        toast.success('Appearance settings saved');
    };

    const saveSecuritySettings = () => {
        localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
        toast.success('Security settings saved');
    };

    const savePreferences = () => {
        localStorage.setItem('preferences', JSON.stringify(preferences));
        toast.success('Preferences saved');
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'preferences', name: 'Preferences', icon: LanguageIcon },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <input
                                            type="text"
                                            value={profileForm.department}
                                            onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                        <input
                                            type="text"
                                            value={profileForm.position}
                                            onChange={(e) => setProfileForm({...profileForm, position: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Push Notifications</p>
                                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.pushNotifications}
                                            onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Task Reminders</p>
                                        <p className="text-sm text-gray-500">Get reminders for pending tasks</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.taskReminders}
                                            onChange={(e) => setNotificationSettings({...notificationSettings, taskReminders: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Contract Alerts</p>
                                        <p className="text-sm text-gray-500">Get alerts for expiring contracts</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.contractAlerts}
                                            onChange={(e) => setNotificationSettings({...notificationSettings, contractAlerts: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Weekly Digest</p>
                                        <p className="text-sm text-gray-500">Receive weekly summary email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.weeklyDigest}
                                            onChange={(e) => setNotificationSettings({...notificationSettings, weeklyDigest: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={saveNotificationSettings} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                                            className={`px-4 py-2 rounded-lg border ${
                                                appearanceSettings.theme === 'light'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Light
                                        </button>
                                        <button
                                            onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                                            className={`px-4 py-2 rounded-lg border ${
                                                appearanceSettings.theme === 'dark'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Dark
                                        </button>
                                        <button
                                            onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'system'})}
                                            className={`px-4 py-2 rounded-lg border ${
                                                appearanceSettings.theme === 'system'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            System
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setAppearanceSettings({...appearanceSettings, fontSize: 'small'})}
                                            className={`px-4 py-2 rounded-lg border ${
                                                appearanceSettings.fontSize === 'small'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Small
                                        </button>
                                        <button
                                            onClick={() => setAppearanceSettings({...appearanceSettings, fontSize: 'medium'})}
                                            className={`px-4 py-2 rounded-lg border ${
                                                appearanceSettings.fontSize === 'medium'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Medium
                                        </button>
                                        <button
                                            onClick={() => setAppearanceSettings({...appearanceSettings, fontSize: 'large'})}
                                            className={`px-4 py-2 rounded-lg border ${
                                                appearanceSettings.fontSize === 'large'
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Large
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Animations</p>
                                        <p className="text-sm text-gray-500">Enable UI animations and transitions</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={appearanceSettings.animations}
                                            onChange={(e) => setAppearanceSettings({...appearanceSettings, animations: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={saveAppearanceSettings} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Security</h2>
                            <div className="space-y-4">
                                <div>
                                    <button className="w-full md:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
                                        Change Password
                                    </button>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.twoFactorAuth}
                                                onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Login Notifications</p>
                                            <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={securitySettings.loginNotifications}
                                                onChange={(e) => setSecuritySettings({...securitySettings, loginNotifications: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                                    <select
                                        value={securitySettings.sessionTimeout}
                                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                                        className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 hour</option>
                                        <option value="120">2 hours</option>
                                        <option value="240">4 hours</option>
                                        <option value="480">8 hours</option>
                                    </select>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={saveSecuritySettings} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences */}
                    {activeTab === 'preferences' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="en">English</option>
                                        <option value="sw">Swahili</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                                    <select
                                        value={preferences.timezone}
                                        onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">America/New York (EST)</option>
                                        <option value="Europe/London">Europe/London (GMT)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                                    <select
                                        value={preferences.dateFormat}
                                        onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
                                    <select
                                        value={preferences.timeFormat}
                                        onChange={(e) => setPreferences({...preferences, timeFormat: e.target.value})}
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="12h">12-hour (AM/PM)</option>
                                        <option value="24h">24-hour</option>
                                    </select>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={savePreferences} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;