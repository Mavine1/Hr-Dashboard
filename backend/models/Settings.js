const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    
    // General Profile Settings
    general: {
        fullName: String,
        email: String,
        phone: String,
        department: String,
        position: String,
        employeeId: String,
        dateOfJoining: Date,
    },
    
    // Notification Preferences
    notifications: {
        email: {
            taskAssigned: { type: Boolean, default: true },
            taskCompleted: { type: Boolean, default: true },
            taskReminder: { type: Boolean, default: true },
            contractExpiring: { type: Boolean, default: true },
            letterSent: { type: Boolean, default: true },
            eventReminder: { type: Boolean, default: true },
            trainingReminder: { type: Boolean, default: true },
            weeklyDigest: { type: Boolean, default: true },
        },
        push: {
            enabled: { type: Boolean, default: true },
            taskUpdates: { type: Boolean, default: true },
            importantAlerts: { type: Boolean, default: true },
        },
        emailFrequency: {
            type: String,
            enum: ['immediate', 'daily', 'weekly'],
            default: 'immediate',
        },
    },
    
    // Appearance Settings
    appearance: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'light',
        },
        sidebarCollapsed: { type: Boolean, default: false },
        fontSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium',
        },
        animations: { type: Boolean, default: true },
        compactView: { type: Boolean, default: false },
    },
    
    // Security Settings
    security: {
        twoFactorAuth: { type: Boolean, default: false },
        sessionTimeout: {
            type: Number,
            default: 60, // minutes
        },
        loginNotifications: { type: Boolean, default: true },
        passwordExpiry: {
            type: Number,
            default: 90, // days
        },
        lastPasswordChange: Date,
        trustedDevices: [{
            deviceId: String,
            deviceName: String,
            lastUsed: Date,
        }],
    },
    
    // Localization
    localization: {
        language: {
            type: String,
            default: 'en',
        },
        timezone: {
            type: String,
            default: 'Africa/Nairobi',
        },
        dateFormat: {
            type: String,
            default: 'DD/MM/YYYY',
        },
        timeFormat: {
            type: String,
            enum: ['12h', '24h'],
            default: '24h',
        },
        currency: {
            type: String,
            default: 'KES',
        },
    },
    
    // Dashboard Preferences
    dashboard: {
        defaultView: {
            type: String,
            default: 'overview',
        },
        widgets: [{
            type: String,
            enum: ['stats', 'tasks', 'events', 'contracts', 'training', 'employees'],
        }],
        layout: {
            type: String,
            enum: ['grid', 'list'],
            default: 'grid',
        },
        showRecentActivity: { type: Boolean, default: true },
        showUpcomingEvents: { type: Boolean, default: true },
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

SettingsSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Settings', SettingsSchema);