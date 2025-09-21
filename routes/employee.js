const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const emp = require('../controllers/employeeController');

router.post('/leaves', authMiddleware('employee'), emp.applyLeave);
router.get('/balance', authMiddleware('employee'), emp.getLeaveBalance);
router.get('/history', authMiddleware('employee'), emp.getLeaveHistory);

module.exports = router;
