const mongoose = require('mongoose');

const DailyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workSummary: {
      type: String,
      required: [true, 'Work summary is required'],
      trim: true,
      minlength: [10, 'Work summary must be at least 10 characters'],
      maxlength: [2000, 'Work summary cannot exceed 2000 characters'],
    },
    blockers: {
      type: String,
      trim: true,
      default: 'None',
      maxlength: [500, 'Blockers cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      default: () => {
        // Store only the date part (midnight UTC) for uniqueness check
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return today;
      },
    },
  },
  { timestamps: true }
);

// One report per user per calendar day
DailyReportSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyReport', DailyReportSchema);
