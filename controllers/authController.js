const authService = require('../services/authService');
const { sendError, sendSuccess } = require('../utils/responseHelpers');

exports.register = async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);
        return sendSuccess(res, { general_message: "User registered successfully", data: { user: result } }, 201);
    } catch (err) {
        sendError(res, err.message, err.status || 500);
    }
};

exports.login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body, res); // Pass res to set cookie
        return sendSuccess(res, { general_message: "Login successful", data: result });
    } catch (err) {
        sendError(res, err.message, err.status || 500);
    }
};

exports.logout = async (req, res) => {
    try {
        await authService.logoutUser(res);
        return sendSuccess(res, { general_message: "Logged out successfully" });
    } catch (err) {
        sendError(res, err.message, err.status || 500);
    }
};
