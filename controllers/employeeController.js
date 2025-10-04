// controllers/employeeController.js
const employeeService = require('../services/employeeService');
const { sendError, sendSuccess } = require('../utils/responseHelpers');

exports.applyLeave = async (req, res) => {
  try {
    const leave = await employeeService.applyLeave(req.user.id, req.body);
    return sendSuccess(res, { general_message: 'Leave applied Successfully', data: { leave } }, 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

exports.getLeaveBalance = async (req, res) => {
  try {
    const balance = await employeeService.getLeaveBalance(req.user.id);
    return sendSuccess(res, { data: { balance } });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

exports.getLeaveHistory = async (req, res) => {
  try {
    // optional: accept query params page, limit
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    const history = await employeeService.getLeaveHistory(req.user.id, { page, limit });
    return sendSuccess(res, { data: { history } });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};
