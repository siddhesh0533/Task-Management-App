const express = require('express');
const router = express.Router();
const { getReports, getReportById, createReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { createReportValidator } = require('../validators/reportValidator');
const { validate } = require('../middleware/validate');

router.use(protect);

router.get('/',    getReports);                                                         // Both roles (filtered)
router.get('/:id', getReportById);                                                      // Both roles (filtered)
router.post('/',   requireRole('employee'), createReportValidator, validate, createReport); // Employee only

module.exports = router;
