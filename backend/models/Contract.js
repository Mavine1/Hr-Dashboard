const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
    contractId: {
        type: String,
        unique: true,
    },
    vendorName: {
        type: String,
        required: [true, 'Please add vendor name'],
    },
    contractType: {
        type: String,
        enum: ['service', 'supply', 'consulting', 'software', 'maintenance', 'other'],
        required: true,
    },
    value: {
        type: Number,
        required: true,
        min: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    renewalDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'expiring', 'terminated', 'draft'],
        default: 'pending',
    },
    description: {
        type: String,
    },
    terms: {
        type: String,
    },
    responsiblePerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    attachments: [{
        name: String,
        url: String,
        size: Number,
    }],
    notes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Auto-generate contract ID: CON-2024-001
ContractSchema.pre('save', async function(next) {
    if (!this.contractId) {
        const count = await mongoose.model('Contract').countDocuments();
        this.contractId = `CON-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

ContractSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Contract', ContractSchema);