// controllers/userController.js
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const userService = require('../services/userService');

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await userService.getCurrentUser(req.user.id);
        return sendSuccess(res, { general_message:'Me user fetched successfully', data: {user} });
    } catch (err) {
        sendError(res, err.message, err.status || 500);
    }
};
