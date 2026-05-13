// const express = require('express');
// const {
//   createTask, getTasks, updateTask, deleteTask, submitDailyLog, getTaskLogs,
// } = require('../controllers/taskController');
// const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.use(protect);

// router.route('/')
//   .get(getTasks)
//   .post(authorizeRoles('admin'), createTask);

// router.route('/:id')
//   .patch(updateTask)                            // Role-restricted in controller
//   .delete(authorizeRoles('admin'), deleteTask);

// router.route('/:id/logs')
//   .post(submitDailyLog)                         // Assigned member only (checked in controller)
//   .get(getTaskLogs);

// module.exports = router;







const express = require('express');
const {
  getTasks, createTask, updateTask, deleteTask, getTeamLogs,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').patch(updateTask).delete(adminOnly, deleteTask);
router.get('/reports/team-logs', adminOnly, getTeamLogs); // new

module.exports = router;