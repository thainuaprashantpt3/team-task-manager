// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Task title is required'],
//       trim: true,
//       maxlength: 200,
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: 2000,
//       default: '',
//     },
//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Project',
//       required: true,
//     },
//     assignedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       default: null, // null = unassigned
//     },
//     assignedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     status: {
//       type: String,
//       enum: ['todo', 'in-progress', 'review', 'done', 'blocked'],
//       default: 'todo',
//     },
//     priority: {
//       type: String,
//       enum: ['low', 'medium', 'high', 'critical'],
//       default: 'medium',
//     },
//     dueDate: {
//       type: Date,
//     },
//     // Computed and stored for performance (avoids live date comparisons)
//     isOverdue: {
//       type: Boolean,
//       default: false,
//     },
//     completedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// // Auto-set isOverdue and completedAt based on status + dueDate
// taskSchema.pre('save', function (next) {
//   if (this.status === 'done' && !this.completedAt) {
//     this.completedAt = new Date();
//   }
//   if (this.dueDate && this.status !== 'done') {
//     this.isOverdue = new Date() > this.dueDate;
//   }
//   next();
// });

// module.exports = mongoose.model('Task', taskSchema);


const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    date:      { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress:  { type: Number, min: 0, max: 100, default: 0 },
    notes:     { type: String, maxlength: 1000, default: '' },
    status:    {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done', 'blocked'],
    },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 2000 },
    project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status:      {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done', 'blocked'],
      default: 'todo',
    },
    priority:    {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    progress:    { type: Number, min: 0, max: 100, default: 0 },
    dueDate:     { type: Date },
    isOverdue:   { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    logs:        [logSchema],
  },
  { timestamps: true }
);

taskSchema.pre('save', function (next) {
  if (this.status === 'done' && !this.completedAt) this.completedAt = new Date();
  if (this.dueDate && this.status !== 'done') this.isOverdue = new Date() > this.dueDate;
  next();
});

module.exports = mongoose.model('Task', taskSchema);