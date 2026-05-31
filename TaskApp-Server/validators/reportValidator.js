const { body } = require('express-validator');

const createReportValidator = [
  body('workSummary')
    .trim()
    .notEmpty().withMessage('Work summary is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Work summary must be 10–2000 characters'),

  body('blockers')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Blockers cannot exceed 500 characters'),
];

module.exports = { createReportValidator };
