  // services/employeeService.js
const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalance');
const mongoose = require('mongoose');

const MS_PER_DAY = 24 * 60 * 60 * 1000;
function daysBetween(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  return Math.floor((e - s) / MS_PER_DAY) + 1;
}

exports.applyLeave = async (userId, payload) => {
  const { leaveType, reasonType, startDate, endDate } = payload;
  if (!leaveType || !reasonType || !startDate || !endDate) {
    const err = new Error('Missing required fields');
    err.status = 400;
    throw err;
  }

  const days = daysBetween(startDate, endDate);
  if (days <= 0) {
    const err = new Error('Invalid date range');
    err.status = 400;
    throw err;
  }

  // Prevent overlaps with pending/approved leaves
  const overlap = await LeaveRequest.findOne({
    employee: userId,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });

  if (overlap) {
    const err = new Error('Overlapping leave exists');
    err.status = 400;
    throw err;
  }

  // Ensure leave balance exists and enough days (policy: require balance to apply)
  const balance = await LeaveBalance.findOne({ employee: userId });
  if (!balance) {
    const err = new Error('Leave balance not found for employee');
    err.status = 400;
    throw err;
  }
  const available = leaveType === 'Casual' ? balance.casual : balance.privilege;
  if (available < days) {
    const err = new Error(`Insufficient ${leaveType} balance`);
    err.status = 400;
    throw err;
  }

  const leave = await LeaveRequest.create({
    employee: userId,
    leaveType,
    reasonType,
    startDate,
    endDate,
    status: 'Pending'
  });

  return leave;
};

exports.getLeaveBalance = async (userId) => {
  const balance = await LeaveBalance.findOne({ employee: userId });
  if (!balance) return { casual: 0, privilege: 0 };
  return balance;
};

exports.getLeaveHistory = async (userId, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const history = await LeaveRequest.find({ employee: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return history;
};
