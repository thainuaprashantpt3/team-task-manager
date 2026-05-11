const mongoose = require('mongoose');

// Members submit daily progress reports against a task
const dailyLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    reportText: {
      type: String,
      required: [true, 'Report text cannot be empty'],
      maxlength: 3000,
    },
    hoursWorked: {
      type: Number,
      min: 0,
      max: 24,
      default: 0,
    },
    statusUpdate: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done', 'blocked'],
    },
    date: {
      type: Date,
      default: () => new Date().setHours(0, 0, 0, 0), // normalize to start of day
    },
  },
  { timestamps: true }
);

// Prevent duplicate daily logs (one per user per task per day)
dailyLogSchema.index({ task: 1, submittedBy: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);