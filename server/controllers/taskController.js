// const Task = require('../models/Task');
// const Project = require('../models/Project');
// const DailyLog = require('../models/DailyLog');
// const { taskSchema, updateTaskSchema, dailyLogSchema } = require('../validators/taskValidator');

// // @desc    Create a task (admin assigns to member)
// // @route   POST /api/tasks
// // @access  Admin
// const createTask = async (req, res, next) => {
//   try {
//     const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({ success: false, message: error.details.map((d) => d.message).join(', ') });
//     }

//     const project = await Project.findById(value.project);
//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found.' });
//     }

//     const task = await Task.create({ ...value, assignedBy: req.user._id });

//     res.status(201).json({ success: true, data: task });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get tasks — all for admin, own tasks for member
// // @route   GET /api/tasks?project=:id
// // @access  Protected
// const getTasks = async (req, res, next) => {
//   try {
//     const filter = {};

//     if (req.query.project) filter.project = req.query.project;
//     if (req.user.role === 'member') filter.assignedTo = req.user._id;
//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.priority) filter.priority = req.query.priority;

//     const tasks = await Task.find(filter)
//       .populate('assignedTo', 'name email avatar')
//       .populate('assignedBy', 'name')
//       .populate('project', 'title deadline')
//       .sort({ dueDate: 1 });

//     // Live overdue check without waiting for cron
//     const now = new Date();
//     const enriched = tasks.map((t) => {
//       const obj = t.toObject();
//       obj.isOverdue = t.dueDate && t.dueDate < now && t.status !== 'done';
//       return obj;
//     });

//     res.status(200).json({ success: true, count: enriched.length, data: enriched });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Update a task
// //          Admin can update anything; member can only update status
// // @route   PATCH /api/tasks/:id
// // @access  Protected (role-restricted fields)
// const updateTask = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ success: false, message: 'Task not found.' });
//     }

//     // Members can only change their own task's status
//     if (req.user.role === 'member') {
//       const isAssigned = task.assignedTo?.toString() === req.user._id.toString();
//       if (!isAssigned) {
//         return res.status(403).json({ success: false, message: 'Not authorized to edit this task.' });
//       }
//       // Strip everything except status from member's payload
//       const { status } = req.body;
//       if (!status) {
//         return res.status(400).json({ success: false, message: 'Members can only update task status.' });
//       }
//       task.status = status;
//       if (status === 'done') task.completedAt = new Date();
//       await task.save();
//       return res.status(200).json({ success: true, data: task });
//     }

//     // Admin: full update with validation
//     const { error, value } = updateTaskSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({ success: false, message: error.details.map((d) => d.message).join(', ') });
//     }

//     const updated = await Task.findByIdAndUpdate(req.params.id, value, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({ success: true, data: updated });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Delete a task
// // @route   DELETE /api/tasks/:id
// // @access  Admin
// const deleteTask = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

//     await task.deleteOne();
//     res.status(200).json({ success: true, message: 'Task deleted.' });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Submit a daily log for a task
// // @route   POST /api/tasks/:id/logs
// // @access  Member (assigned to task)
// const submitDailyLog = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

//     if (task.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, message: 'You are not assigned to this task.' });
//     }

//     const { error, value } = dailyLogSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({ success: false, message: error.details.map((d) => d.message).join(', ') });
//     }

//     // Update the task's status if member included a status update
//     if (value.statusUpdate) {
//       task.status = value.statusUpdate;
//       if (value.statusUpdate === 'done') task.completedAt = new Date();
//       await task.save();
//     }

//     const log = await DailyLog.create({
//       task: task._id,
//       submittedBy: req.user._id,
//       project: task.project,
//       ...value,
//     });

//     res.status(201).json({ success: true, data: log });
//   } catch (err) {
//     // Handle duplicate log (unique index: task + user + date)
//     if (err.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: 'You have already submitted a log for this task today.',
//       });
//     }
//     next(err);
//   }
// };

// // @desc    Get all daily logs for a task
// // @route   GET /api/tasks/:id/logs
// // @access  Admin or assigned member
// const getTaskLogs = async (req, res, next) => {
//   try {
//     const logs = await DailyLog.find({ task: req.params.id })
//       .populate('submittedBy', 'name email avatar')
//       .sort({ date: -1 });

//     res.status(200).json({ success: true, count: logs.length, data: logs });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { createTask, getTasks, updateTask, deleteTask, submitDailyLog, getTaskLogs };










const Task    = require('../models/Task');
const Project = require('../models/Project');

// Recalculate and save project progress after any task change
const syncProjectProgress = async (projectId) => {
  const tasks    = await Task.find({ project: projectId });
  const total    = tasks.length;
  const done     = tasks.filter(t => t.status === 'done').length;
  await Project.findByIdAndUpdate(projectId, {
    progress: total > 0 ? Math.round((done / total) * 100) : 0,
  });
};

// GET /api/tasks
// ?project=id  filter by project
// ?status=     filter by status
// Admin sees all; member sees only their assigned tasks
const getTasks = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.status)  filter.status  = req.query.status;
    if (req.user.role === 'member') filter.assignedTo = req.user._id;

    const tasks = await Task.find(filter)
      .populate('assignedTo',     'name email avatar department')
      .populate('assignedBy',     'name')
      .populate('project',        'title deadline status')
      .populate('logs.updatedBy', 'name')
      .sort({ dueDate: 1, createdAt: -1 });

    const now      = new Date();
    const enriched = tasks.map(t => {
      const obj     = t.toObject();
      obj.isOverdue = !!(t.dueDate && t.dueDate < now && t.status !== 'done');
      obj.logs      = [...(t.logs || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
      return obj;
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) { next(err); }
};

// POST /api/tasks — admin only
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;

    if (!title?.trim() || !project)
      return res.status(400).json({ success: false, message: 'Title and project are required.' });

    // Verify project exists
    const proj = await Project.findById(project);
    if (!proj)
      return res.status(404).json({ success: false, message: 'Project not found.' });

    // Verify assignee is a member of the project (if provided)
    if (assignedTo) {
      const isMember = proj.assignedMembers.some(m => m.toString() === assignedTo);
      if (!isMember)
        return res.status(400).json({
          success: false,
          message: 'Assigned user is not a member of this project. Add them to the project first.',
        });
    }

    const task = await Task.create({
      title: title.trim(), description, project,
      assignedTo: assignedTo || null,
      priority:   priority   || 'medium',
      status:     status     || 'todo',
      dueDate,
      assignedBy: req.user._id,
      logs: [],
    });

    await syncProjectProgress(project);

    const populated = await Task.findById(task._id)
      .populate('assignedTo',     'name email avatar department')
      .populate('assignedBy',     'name')
      .populate('project',        'title deadline');

    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

// PATCH /api/tasks/:id
// Admin: can update all fields
// Member: can update status, progress, notes on their own task — auto-creates daily log
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ success: false, message: 'Task not found.' });

    if (req.user.role === 'member') {
      // Member can only update their assigned task
      if (task.assignedTo?.toString() !== req.user._id.toString())
        return res.status(403).json({ success: false, message: 'You are not assigned to this task.' });

      const { status, progress, notes } = req.body;

      if (status !== undefined)   task.status   = status;
      if (progress !== undefined) task.progress = Math.min(100, Math.max(0, Number(progress)));
      if (status === 'done')      task.completedAt = new Date();

      // Upsert today's log — one log per user per day
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      const todayMs  = today.getTime();
      const existing = task.logs.find(l => {
        const d = new Date(l.date); d.setHours(0,0,0,0);
        return d.getTime() === todayMs && l.updatedBy?.toString() === req.user._id.toString();
      });

      if (existing) {
        if (status   !== undefined) existing.status   = status;
        if (progress !== undefined) existing.progress = Math.min(100, Math.max(0, Number(progress)));
        if (notes)                  existing.notes    = notes.trim();
        existing.date      = new Date();
        existing.updatedBy = req.user._id;
      } else {
        task.logs.push({
          date:      new Date(),
          updatedBy: req.user._id,
          progress:  progress !== undefined ? Math.min(100, Math.max(0, Number(progress))) : task.progress,
          notes:     notes ? notes.trim() : '',
          status:    status || task.status,
        });
      }

      await task.save();
      await syncProjectProgress(task.project);

      const updated = await Task.findById(task._id)
        .populate('assignedTo',     'name email avatar')
        .populate('assignedBy',     'name')
        .populate('logs.updatedBy', 'name');

      return res.json({ success: true, data: updated });
    }

    // Admin: full update
    const { title, description, assignedTo, status, priority, dueDate, progress } = req.body;

    if (title       !== undefined) task.title       = title;
    if (description !== undefined) task.description = description;
    if (priority    !== undefined) task.priority    = priority;
    if (dueDate     !== undefined) task.dueDate     = dueDate;
    if (progress    !== undefined) task.progress    = Math.min(100, Math.max(0, Number(progress)));

    // If reassigning, verify new assignee is project member
    if (assignedTo !== undefined) {
      if (assignedTo) {
        const proj = await Project.findById(task.project);
        const isMember = proj?.assignedMembers.some(m => m.toString() === assignedTo);
        if (!isMember)
          return res.status(400).json({
            success: false,
            message: 'User is not a member of this project.',
          });
      }
      task.assignedTo = assignedTo || null;
    }

    if (status !== undefined) {
      task.status = status;
      if (status === 'done') task.completedAt = new Date();
    }

    await task.save();
    await syncProjectProgress(task.project);

    const updated = await Task.findById(task._id)
      .populate('assignedTo',     'name email avatar')
      .populate('assignedBy',     'name')
      .populate('logs.updatedBy', 'name');

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

// DELETE /api/tasks/:id — admin only
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ success: false, message: 'Task not found.' });

    const projectId = task.project;
    await task.deleteOne();
    await syncProjectProgress(projectId);
    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) { next(err); }
};

// GET /api/tasks/reports/team-logs
// Admin: see every member's logs across all tasks/projects
// Supports ?memberId=  ?projectId=  ?date=YYYY-MM-DD  filters
const getTeamLogs = async (req, res, next) => {
  try {
    const { memberId, projectId, date } = req.query;

    // Build task filter
    const taskFilter = {};
    if (projectId) taskFilter.project = projectId;

    const tasks = await Task.find(taskFilter)
      .populate('assignedTo', 'name email avatar department')
      .populate('project',    'title deadline status')
      .populate('logs.updatedBy', 'name email');

    // Flatten all logs into a single array with task/project context
    let allLogs = [];

    tasks.forEach(task => {
      (task.logs || []).forEach(log => {
        allLogs.push({
          logId:      log._id,
          date:       log.date,
          notes:      log.notes,
          progress:   log.progress,
          status:     log.status,
          updatedBy:  log.updatedBy,
          task: {
            _id:      task._id,
            title:    task.title,
            priority: task.priority,
            status:   task.status,
            dueDate:  task.dueDate,
            isOverdue: task.isOverdue,
          },
          project: {
            _id:    task.project?._id,
            title:  task.project?.title,
            status: task.project?.status,
          },
          assignedTo: task.assignedTo,
        });
      });
    });

    // Filter by memberId
    if (memberId) {
      allLogs = allLogs.filter(l =>
        l.updatedBy?._id?.toString() === memberId ||
        l.assignedTo?._id?.toString() === memberId
      );
    }

    // Filter by date (match same calendar day)
    if (date) {
      const target = new Date(date);
      target.setHours(0, 0, 0, 0);
      allLogs = allLogs.filter(l => {
        const d = new Date(l.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === target.getTime();
      });
    }

    // Sort newest first
    allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by member for summary view
    const byMember = {};
    allLogs.forEach(log => {
      const uid  = log.updatedBy?._id?.toString() || 'unknown';
      const name = log.updatedBy?.name || 'Unknown';
      if (!byMember[uid]) {
        byMember[uid] = {
          member:   log.updatedBy,
          totalLogs: 0,
          avgProgress: 0,
          logs:     [],
        };
      }
      byMember[uid].totalLogs++;
      byMember[uid].logs.push(log);
    });

    // Compute avg progress per member
    Object.values(byMember).forEach(m => {
      m.avgProgress = m.logs.length
        ? Math.round(m.logs.reduce((s, l) => s + (l.progress || 0), 0) / m.logs.length)
        : 0;
    });

    res.json({
      success:  true,
      total:    allLogs.length,
      byMember: Object.values(byMember),
      logs:     allLogs,
    });
  } catch (err) { next(err); }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTeamLogs };