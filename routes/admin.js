const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const admin = require('../controllers/adminController');

router.get('/employees', authMiddleware('admin'), admin.getEmployees);
router.get('/leaves/all', authMiddleware('admin'), admin.getAllLeaveRequests);
router.get('/leaves/pending', authMiddleware('admin'), admin.getPendingLeaves);
router.patch('/leaves/:id', authMiddleware('admin'), admin.updateLeaveStatus);
router.patch('/balance/:employeeId', authMiddleware('admin'), admin.updateLeaveBalance);
router.get('/balance/:employeeId', authMiddleware('admin'), admin.getEmployeeLeaveBalance);

module.exports = router;
