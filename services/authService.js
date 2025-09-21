const User = require('../models/User');
const LeaveBalance = require('../models/LeaveBalance');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authCookie = process.env.AUTH_COOKIE_NAME;

exports.registerUser = async (data) => {
    const { email, employeeId, name, department, password, role } = data;

    if (!['employee', 'admin'].includes(role)) {
        const error = new Error('Invalid role');
        error.status = 400;
        throw error;
    }

    if (role === 'employee' && (!employeeId || !department)) {
        const error = new Error('Employee ID and Department required for employees');
        error.status = 400;
        throw error;
    }

    try {
        const user = new User({ email, employeeId, name, department, password, role });
        await user.save();
        // after saving user:
        if (role === 'employee') {
            await LeaveBalance.create({ employee: user._id, casual: 12, privilege: 12 });
        }
        return { message: `${role} registered successfully` };
    } catch (err) {
        // Handle duplicate key errors
        if (err.code === 11000) {
            // err.keyValue contains the field that caused duplicate
            const duplicateField = Object.keys(err.keyValue)[0];
            const friendlyMessage = duplicateField === 'email'
                ? 'Email is already registered'
                : duplicateField === 'employeeId'
                ? 'Employee ID is already registered'
                : 'Duplicate value detected';
            const error = new Error(friendlyMessage);
            error.status = 400;
            throw error;
        }
        // Other errors
        throw err;
    }
};



exports.loginUser = async (data, res) => {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('User not found');
        error.status = 400;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Incorrect password');
        error.status = 400;
        throw error;
    }

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set HTTP-only cookie
    res.cookie(authCookie, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000
    });

    return { message: 'Login successful', token, role: user.role };
};

exports.logoutUser = async (res) => {
    res.clearCookie(authCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
};
