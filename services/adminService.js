// services/adminService.js
const mongoose = require('mongoose');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalance');

const MS_PER_DAY = 24 * 60 * 60 * 1000;
function daysBetween(startDate, endDate) {
  return Math.floor((new Date(endDate) - new Date(startDate)) / MS_PER_DAY) + 1;
}

exports.getEmployees = async () => {
  const employees = await User.find({ role: 'employee' }).select('-password');
  return employees;
};

exports.getPendingLeaves = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const requests = await LeaveRequest.find({ status: 'Pending' })
    .populate('employee', 'name department employeeId')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);
  return requests;
};

/**
 * Approve/Reject a leave request (atomic)
 * adminId: id of admin performing the action
 * leaveId: id of leave request
 * payload: { status: 'Approved'|'Rejected', comment: string }
 */
exports.updateLeaveStatus = async (adminId, leaveId, payload) => {
  const { status, comment } = payload;
  if (!['Approved', 'Rejected'].includes(status)) {
    const err = new Error('Invalid status. Use Approved or Rejected');
    err.status = 400;
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const leave = await LeaveRequest.findById(leaveId).session(session);
    if (!leave) {
      const err = new Error('Leave request not found');
      err.status = 404;
      throw err;
    }
    if (leave.status !== 'Pending') {
      const err = new Error('Leave request already processed');
      err.status = 400;
      throw err;
    }

    if (status === 'Approved') {
      const days = daysBetween(leave.startDate, leave.endDate);
      const balance = await LeaveBalance.findOne({ employee: leave.employee }).session(session);
      if (!balance) {
        const err = new Error('Leave balance not found for employee');
        err.status = 400;
        throw err;
      }
      const field = leave.leaveType === 'Casual' ? 'casual' : 'privilege';
      if (balance[field] < days) {
        const err = new Error(`Not enough ${leave.leaveType} balance to approve`);
        err.status = 400;
        throw err;
      }
      balance[field] -= days;
      await balance.save({ session });
    }

    leave.status = status;
    leave.admin = adminId;
    leave.adminComment = comment || '';
    await leave.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate employee for response
    await leave.populate('employee', 'name department employeeId');

    return leave;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

exports.updateLeaveBalance = async (employeeId, payload) => {
  // Accept deltas to add/reduce; safer than replacing
  const { casualDelta = 0, privilegeDelta = 0 } = payload;

  // Use $inc to atomically adjust
  const balance = await LeaveBalance.findOneAndUpdate(
    { employee: employeeId },
    { $inc: { casual: casualDelta, privilege: privilegeDelta } },
    { new: true, upsert: true }
  );

  return balance;
};
