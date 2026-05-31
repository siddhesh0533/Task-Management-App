const DailyReport = require('../models/DailyReport');

// @desc    Get all reports (manager: all | employee: own)
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const filter = req.user.role === 'manager' ? {} : { userId: req.user._id };

    const reports = await DailyReport.find(filter)
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id).populate('userId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Employee can only view own report
    if (
      req.user.role === 'employee' &&
      report.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit daily report
// @route   POST /api/reports
// @access  Private (employee only)
const createReport = async (req, res) => {
  try {
    const { workSummary, blockers } = req.body;

    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Check if already submitted today
    const existing = await DailyReport.findOne({ userId: req.user._id, date: today });
    if (existing) {
      return res.status(400).json({
        message: 'You have already submitted a report for today',
      });
    }

    const report = await DailyReport.create({
      userId: req.user._id,
      workSummary,
      blockers: blockers || 'None',
      date: today,
    });

    const populated = await report.populate('userId', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    // Handle duplicate key error from unique index
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Report for today already submitted' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getReports, getReportById, createReport };
