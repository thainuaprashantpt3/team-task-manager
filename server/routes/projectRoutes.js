// const express = require('express');
// const {
//   createProject, getAllProjects, getProjectById, updateProject, deleteProject,
// } = require('../controllers/projectController');
// const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.use(protect);

// router.route('/')
//   .get(getAllProjects)
//   .post(createProject);                        // Both roles can create

// router.route('/:id')
//   .get(getProjectById)
//   .patch(updateProject)                        // Admin or owner — checked in controller
//   .delete(authorizeRoles('admin'), deleteProject);

// module.exports = router;





const express = require('express');
const {
  getAllProjects, getProjectById, createProject, updateProject, deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(getAllProjects).post(createProject);
router.route('/:id').get(getProjectById).patch(updateProject).delete(adminOnly, deleteProject);

module.exports = router;