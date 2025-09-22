const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Casual', 'Privilege'],
        required: true
    },
    reasonType: {
        type: String,
        enum: ['Sick', 'Vacation'],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    status:    { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    admin:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who approved/rejected
    adminComment: { type: String }
}, { timestamps: true });

// Compound index to optimize queries by employee, status, and startDate
leaveRequestSchema.index({ employee: 1, status: 1, startDate: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
