const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.post('/logout', authMiddleware(), authController.logout);

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
