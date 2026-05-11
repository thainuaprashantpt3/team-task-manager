// const express = require('express');
// const {
//   getAllUsers, getMe, addMember, toggleUserStatus,
// } = require('../controllers/userController');
// const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.use(protect); // All user routes require auth

// router.get('/me', getMe);
// router.get('/', authorizeRoles('admin'), getAllUsers);
// router.post('/', authorizeRoles('admin'), addMember);
// router.patch('/:id/toggle', authorizeRoles('admin'), toggleUserStatus);

// module.exports = router;




const express = require('express');
const {
  getAllUsers, getMe, addMember, updateMember, toggleUserStatus,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/me',              getMe);
router.get('/',                getAllUsers);
router.post('/',               adminOnly, addMember);
router.patch('/:id',           adminOnly, updateMember);
router.patch('/:id/toggle',    adminOnly, toggleUserStatus);

module.exports = router;