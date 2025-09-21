// controllers/adminController.js
const adminService = require('../services/adminService');
const { sendError, sendSuccess } = require('../utils/responseHelpers');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await adminService.getEmployees();
    return sendSuccess(res, { data: { employees } });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

exports.getPendingLeaves = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    const pending = await adminService.getPendingLeaves({ page, limit });
    return sendSuccess(res, { data: { pending } });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const leave = await adminService.updateLeaveStatus(adminId, req.params.id, req.body);
    return sendSuccess(res, { general_message: `Leave ${leave.status}`, data: { leave } });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

exports.updateLeaveBalance = async (req, res) => {
  try {
    const balance = await adminService.updateLeaveBalance(req.params.employeeId, req.body);
    return sendSuccess(res, { general_message: 'Balance updated', data: { balance } });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};
