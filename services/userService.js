// services/userService.js
const User = require('../models/User');

exports.getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select('name role email');
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    console.log("user in service", user);
    return user;
};
