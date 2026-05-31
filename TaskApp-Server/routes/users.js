const express = require('express');
const router = express.Router();
const { getUsers, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

router.use(protect);

router.get('/',   requireRole('manager'), getUsers); // Manager only — for assign dropdown
router.get('/me', getMe);                            // Both roles

module.exports = router;
