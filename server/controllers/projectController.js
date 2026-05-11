// // const Project = require('../models/Project');
// // const Task = require('../models/Task');
// // const { projectSchema, updateProjectSchema } = require('../validators/projectValidator');

// // // @desc    Create a project
// // // @route   POST /api/projects
// // // @access  Admin + Member
// // const createProject = async (req, res, next) => {
// //   try {
// //     const { error, value } = projectSchema.validate(req.body, { abortEarly: false });
// //     if (error) {
// //       return res.status(400).json({ success: false, message: error.details.map((d) => d.message).join(', ') });
// //     }

// //     const project = await Project.create({ ...value, owner: req.user._id });
// //     res.status(201).json({ success: true, data: project });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // // @desc    Get all projects
// // //          Admin sees all; members see only their projects
// // // @route   GET /api/projects
// // // @access  Protected
// // const getAllProjects = async (req, res, next) => {
// //   try {
// //     const filter =
// //       req.user.role === 'admin'
// //         ? {}
// //         : { $or: [{ owner: req.user._id }, { members: req.user._id }] };

// //     const projects = await Project.find(filter)
// //       .populate('owner', 'name email')
// //       .populate('members', 'name email')
// //       .sort({ createdAt: -1 });

// //     // Flag overdue projects dynamically
// //     const now = new Date();
// //     const enriched = projects.map((p) => {
// //       const obj = p.toObject();
// //       obj.isOverdue = p.deadline && p.deadline < now && p.status !== 'completed';
// //       return obj;
// //     });

// //     res.status(200).json({ success: true, count: enriched.length, data: enriched });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // // @desc    Get single project with task summary
// // // @route   GET /api/projects/:id
// // // @access  Protected
// // const getProjectById = async (req, res, next) => {
// //   try {
// //     const project = await Project.findById(req.params.id)
// //       .populate('owner', 'name email')
// //       .populate('members', 'name email avatar department');

// //     if (!project) {
// //       return res.status(404).json({ success: false, message: 'Project not found.' });
// //     }

// //     // Compute real-time progress from tasks
// //     const tasks = await Task.find({ project: project._id });
// //     const total = tasks.length;
// //     const done = tasks.filter((t) => t.status === 'done').length;
// //     const progress = total > 0 ? Math.round((done / total) * 100) : 0;

// //     // Persist updated progress
// //     project.progress = progress;
// //     await project.save();

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         ...project.toObject(),
// //         progress,
// //         taskSummary: { total, done, remaining: total - done },
// //       },
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // // @desc    Update a project
// // // @route   PATCH /api/projects/:id
// // // @access  Admin or Project Owner
// // const updateProject = async (req, res, next) => {
// //   try {
// //     const { error, value } = updateProjectSchema.validate(req.body, { abortEarly: false });
// //     if (error) {
// //       return res.status(400).json({ success: false, message: error.details.map((d) => d.message).join(', ') });
// //     }

// //     const project = await Project.findById(req.params.id);
// //     if (!project) {
// //       return res.status(404).json({ success: false, message: 'Project not found.' });
// //     }

// //     const isOwner = project.owner.toString() === req.user._id.toString();
// //     if (req.user.role !== 'admin' && !isOwner) {
// //       return res.status(403).json({ success: false, message: 'Not authorized to edit this project.' });
// //     }

// //     const updated = await Project.findByIdAndUpdate(req.params.id, value, {
// //       new: true,
// //       runValidators: true,
// //     });

// //     res.status(200).json({ success: true, data: updated });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // // @desc    Delete a project (and its tasks)
// // // @route   DELETE /api/projects/:id
// // // @access  Admin only
// // const deleteProject = async (req, res, next) => {
// //   try {
// //     const project = await Project.findById(req.params.id);
// //     if (!project) {
// //       return res.status(404).json({ success: false, message: 'Project not found.' });
// //     }

// //     // Cascade delete all tasks in this project
// //     await Task.deleteMany({ project: project._id });
// //     await project.deleteOne();

// //     res.status(200).json({ success: true, message: 'Project and its tasks deleted.' });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };











// const Project = require('../models/Project');
// const Task    = require('../models/Task');
// const { projectSchema, updateProjectSchema } = require('../validators/projectValidator');

// // @desc    Create a project
// // @route   POST /api/projects
// // @access  Admin + Member
// const createProject = async (req, res, next) => {
//   try {
//     const { error, value } = projectSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((d) => d.message).join(', '),
//       });
//     }

//     // Auto-add creator as a member of the project
//     const membersSet = new Set(value.members || []);
//     membersSet.add(req.user._id.toString());

//     const project = await Project.create({
//       ...value,
//       owner:   req.user._id,
//       members: [...membersSet],
//     });

//     const populated = await Project.findById(project._id)
//       .populate('owner', 'name email')
//       .populate('members', 'name email');

//     res.status(201).json({ success: true, data: populated });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get all projects
// //          Admin — sees all projects
// //          Member — sees projects they own OR are a member of
// // @route   GET /api/projects
// // @access  Protected
// const getAllProjects = async (req, res, next) => {
//   try {
//     const filter = req.user.role === 'admin'
//       ? {}
//       : {
//           $or: [
//             { owner:   req.user._id },
//             { members: req.user._id },
//           ],
//         };

//     const projects = await Project.find(filter)
//       .populate('owner',   'name email')
//       .populate('members', 'name email')
//       .sort({ createdAt: -1 });

//     const now = new Date();
//     const enriched = projects.map((p) => {
//       const obj    = p.toObject();
//       obj.isOverdue = p.deadline && p.deadline < now && p.status !== 'completed';
//       return obj;
//     });

//     res.status(200).json({ success: true, count: enriched.length, data: enriched });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get single project with task summary
// // @route   GET /api/projects/:id
// // @access  Protected
// const getProjectById = async (req, res, next) => {
//   try {
//     const project = await Project.findById(req.params.id)
//       .populate('owner',   'name email')
//       .populate('members', 'name email avatar department');

//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found.' });
//     }

//     // Members can only view projects they belong to
//     if (req.user.role === 'member') {
//       const isMember = project.members.some(
//         (m) => m._id.toString() === req.user._id.toString()
//       );
//       const isOwner = project.owner._id.toString() === req.user._id.toString();
//       if (!isMember && !isOwner) {
//         return res.status(403).json({ success: false, message: 'Not authorized to view this project.' });
//       }
//     }

//     // Compute real-time progress from tasks
//     const tasks    = await Task.find({ project: project._id });
//     const total    = tasks.length;
//     const done     = tasks.filter((t) => t.status === 'done').length;
//     const progress = total > 0 ? Math.round((done / total) * 100) : 0;

//     project.progress = progress;
//     await project.save();

//     const now = new Date();

//     res.status(200).json({
//       success: true,
//       data: {
//         ...project.toObject(),
//         progress,
//         isOverdue:   project.deadline && project.deadline < now && project.status !== 'completed',
//         taskSummary: { total, done, remaining: total - done },
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Update a project
// // @route   PATCH /api/projects/:id
// // @access  Admin or Project Owner
// const updateProject = async (req, res, next) => {
//   try {
//     const { error, value } = updateProjectSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((d) => d.message).join(', '),
//       });
//     }

//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found.' });
//     }

//     const isOwner = project.owner.toString() === req.user._id.toString();
//     if (req.user.role !== 'admin' && !isOwner) {
//       return res.status(403).json({ success: false, message: 'Not authorized to edit this project.' });
//     }

//     const updated = await Project.findByIdAndUpdate(req.params.id, value, {
//       new: true, runValidators: true,
//     })
//       .populate('owner',   'name email')
//       .populate('members', 'name email');

//     res.status(200).json({ success: true, data: updated });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Delete a project and all its tasks
// // @route   DELETE /api/projects/:id
// // @access  Admin only
// const deleteProject = async (req, res, next) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found.' });
//     }

//     await Task.deleteMany({ project: project._id });
//     await project.deleteOne();

//     res.status(200).json({ success: true, message: 'Project and its tasks deleted.' });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   createProject,
//   getAllProjects,
//   getProjectById,
//   updateProject,
//   deleteProject,
// };









const Project = require('../models/Project');
const Task    = require('../models/Task');

const enrichProject = (p) => {
  const obj     = p.toObject ? p.toObject() : { ...p };
  obj.isOverdue = !!(p.deadline && new Date(p.deadline) < new Date() && p.status !== 'completed');
  return obj;
};

// GET /api/projects
const getAllProjects = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { $or: [{ owner: req.user._id }, { assignedMembers: req.user._id }] };

    const projects = await Project.find(filter)
      .populate('owner',           'name email department')
      .populate('assignedMembers', 'name email department avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, data: projects.map(enrichProject) });
  } catch (err) { next(err); }
};

// GET /api/projects/:id  (includes task summary)
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner',           'name email department')
      .populate('assignedMembers', 'name email department avatar');

    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found.' });

    if (req.user.role === 'member') {
      const isMember = project.assignedMembers.some(m => m._id.toString() === req.user._id.toString());
      const isOwner  = project.owner._id.toString() === req.user._id.toString();
      if (!isMember && !isOwner)
        return res.status(403).json({ success: false, message: 'Not authorized to view this project.' });
    }

    // Fetch tasks grouped for this project
    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo',     'name email avatar')
      .populate('assignedBy',     'name')
      .populate('logs.updatedBy', 'name')
      .sort({ createdAt: -1 });

    const total    = tasks.length;
    const done     = tasks.filter(t => t.status === 'done').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    // Persist progress
    project.progress = progress;
    await project.save();

    res.json({
      success: true,
      data: {
        ...enrichProject(project),
        tasks,
        taskSummary: {
          total,
          done,
          inProgress: tasks.filter(t => t.status === 'in-progress').length,
          todo:       tasks.filter(t => t.status === 'todo').length,
          blocked:    tasks.filter(t => t.status === 'blocked').length,
          overdue:    tasks.filter(t => t.isOverdue).length,
        },
      },
    });
  } catch (err) { next(err); }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { title, description, deadline, status, assignedMembers } = req.body;
    if (!title?.trim())
      return res.status(400).json({ success: false, message: 'Title is required.' });

    // Always include the creator
    const membersSet = new Set((assignedMembers || []).map(String));
    membersSet.add(req.user._id.toString());

    const project = await Project.create({
      title: title.trim(), description, deadline, status,
      owner: req.user._id,
      assignedMembers: [...membersSet],
    });

    const populated = await Project.findById(project._id)
      .populate('owner',           'name email department')
      .populate('assignedMembers', 'name email department avatar');

    res.status(201).json({ success: true, data: enrichProject(populated) });
  } catch (err) { next(err); }
};

// PATCH /api/projects/:id
// Admin can update anything including adding/removing members
// Owner can update basic fields
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found.' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner)
      return res.status(403).json({ success: false, message: 'Not authorized to edit this project.' });

    const { title, description, deadline, status, assignedMembers } = req.body;

    if (title       !== undefined) project.title       = title;
    if (description !== undefined) project.description = description;
    if (deadline    !== undefined) project.deadline    = deadline;
    if (status      !== undefined) project.status      = status;

    // Merge members — always keep owner in the list
    if (assignedMembers !== undefined) {
      const membersSet = new Set(assignedMembers.map(String));
      membersSet.add(project.owner.toString());
      project.assignedMembers = [...membersSet];
    }

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner',           'name email department')
      .populate('assignedMembers', 'name email department avatar');

    res.json({ success: true, data: enrichProject(updated) });
  } catch (err) { next(err); }
};

// DELETE /api/projects/:id — admin only
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found.' });

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ success: true, message: 'Project and all tasks deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };