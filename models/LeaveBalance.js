const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
    employee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true  // one balance record per employee
    },
    casual:    { type: Number, default: 10 }, // Casual Leave balance
    privilege: { type: Number, default: 10 }  // Privilege Leave balance
}, { timestamps: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
