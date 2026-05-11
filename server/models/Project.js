
// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Project title is required'],
//       trim: true,
//       maxlength: 120,
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: 1000,
//       default: '',
//     },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     members: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//     ],
//     deadline: {
//       type: Date,
//     },
//     status: {
//       type: String,
//       enum: ['planning', 'active', 'on-hold', 'completed'],
//       default: 'planning',
//     },
//     // Auto-calculated from task completion ratio (updated via virtual or hook)
//     progress: {
//       type: Number,
//       min: 0,
//       max: 100,
//       default: 0,
//     },
//     isOverdue: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// // // Virtual to check overdue status dynamically before queries
// // projectSchema.pre(/^find/, function (next) {
// //   this.find({}).then(() => {}); // placeholder — overdue flag set by cron/controller
// //   next();
// // });

// module.exports = mongoose.model('Project', projectSchema);



const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true, trim: true, maxlength: 120 },
    description:     { type: String, default: '', maxlength: 1000 },
    owner:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deadline:        { type: Date },
    status:          {
      type: String,
      enum: ['planning', 'active', 'on-hold', 'completed'],
      default: 'planning',
    },
    progress:  { type: Number, min: 0, max: 100, default: 0 },
    isOverdue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);