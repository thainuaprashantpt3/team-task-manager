// const User = require('../models/User');

// // @desc    Get all users (admin view)
// // @route   GET /api/users
// // @access  Admin
// const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.find().select('-password').sort({ createdAt: -1 });
//     res.status(200).json({ success: true, count: users.length, data: users });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Get logged-in user's profile
// // @route   GET /api/users/me
// // @access  Protected
// const getMe = async (req, res) => {
//   res.status(200).json({ success: true, data: req.user });
// };

// // @desc    Admin adds a new team member
// // @route   POST /api/users
// // @access  Admin
// const addMember = async (req, res, next) => {
//   try {
//     const { name, email, password, department } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ success: false, message: 'Email already registered.' });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: 'member',     // Admin-created users are always members
//       department,
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         department: user.department,
//         isActive: user.isActive,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc    Toggle user active/inactive (for leave management — never deletes)
// // @route   PATCH /api/users/:id/toggle
// // @access  Admin
// const toggleUserStatus = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found.' });
//     }

//     // Prevent admin from deactivating themselves
//     if (user._id.toString() === req.user._id.toString()) {
//       return res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
//     }

//     user.isActive = !user.isActive;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: `User is now ${user.isActive ? 'active' : 'inactive'}.`,
//       data: { _id: user._id, name: user.name, isActive: user.isActive },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { getAllUsers, getMe, addMember, toggleUserStatus };




const User = require('../models/User');
const Joi  = require('joi');

// const memberSchema = Joi.object({
//   name:       Joi.string().min(2).max(60).required(),
//   email:      Joi.string().email().required(),
//   password:   Joi.string().min(8)
//                 .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//                 .required()
//                 .messages({ 'string.pattern.base': 'Password needs uppercase, lowercase, and a number.' }),
//   department: Joi.string().max(60).optional().allow(''),
// });

const addMemberSchema = Joi.object({
  name:       Joi.string().min(2).max(60).required(),
  email:      Joi.string().email().required(),
  password:   Joi.string().min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .required()
                .messages({
                  'string.pattern.base': 'Password needs uppercase, lowercase, and a number.',
                }),
  department: Joi.string().max(60).optional().allow(''),
});

// GET /api/users — all users (admin sees all, member sees active members)
const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { isActive: true, role: 'member' };
    const users  = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

// GET /api/users/me
const getMe = (req, res) => res.json({ success: true, data: req.user });

// POST /api/users — admin adds member
// const addMember = async (req, res, next) => {
//   try {
//     const { error, value } = memberSchema.validate(req.body, { abortEarly: false });
//     if (error)
//       return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

//     const exists = await User.findOne({ email: value.email });
//     if (exists) return res.status(409).json({ success: false, message: 'Email already registered.' });

//     const user = await User.create({ ...value, role: 'member' });
//     res.status(201).json({
//       success: true,
//       data: { _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, department: user.department },
//     });
//   } catch (err) { next(err); }
// };


const addMember = async (req, res, next) => {
  try {
    const { error, value } = addMemberSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join(', '),
      });
    }

    const exists = await User.findOne({ email: value.email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name:       value.name,
      email:      value.email,
      password:   value.password,
      department: value.department || '',
      role:       'member',
    });

    res.status(201).json({
      success: true,
      data: {
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
        isActive:   user.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id — admin edits member
const updateMember = async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (name)       user.name       = name;
    if (email)      user.email      = email;
    if (department !== undefined) user.department = department;
    await user.save();

    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// PATCH /api/users/:id/toggle — toggle isActive
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user._id.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account.' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User is now ${user.isActive ? 'active' : 'inactive'}.`, data: { _id: user._id, isActive: user.isActive } });
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getMe, addMember, updateMember, toggleUserStatus };