const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, employeeId, name, department, password, role } = req.body;

        // Validate role
        if (!['employee', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Employee must have employeeId and department
        if (role === 'employee' && (!employeeId || !department)) {
            return res.status(400).json({ message: 'Employee ID and Department required for employees' });
        }

        const user = new User({ email, employeeId, name, department, password, role });
        await user.save();

        res.status(201).json({ message: `${role} registered successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        // Generate JWT with role
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set HTTP-only cookie
        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
          httpOnly: true,        // JS can't access document.cookie
          secure: process.env.NODE_ENV === 'production', // send only over HTTPS in prod
          sameSite: 'Strict',    // protects against CSRF
          maxAge: 60 * 60 * 1000 // 1 hour in ms
        });

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie(process.env.AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;


// {
//   "email": "john.doe@company.com",
//   "employeeId": "E12345",
//   "name": "John Doe",
//   "department": "IT",
//   "password": "StrongPass123!",
//   "role": "employee"
// }

// {
//   "email": "admin.one@company.com",
//   "name": "Alice Admin",
//   "password": "AdminPower#1",
//   "role": "admin"
// }
