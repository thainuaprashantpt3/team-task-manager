const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(2000).optional().allow(''),
  project: Joi.string().length(24).required(),
  assignedTo: Joi.string().length(24).optional().allow(null, ''),
  status: Joi.string()
    .valid('todo', 'in-progress', 'review', 'done', 'blocked')
    .default('todo'),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'critical')
    .default('medium'),
  dueDate: Joi.date().optional(),
});

const updateTaskSchema = taskSchema.fork(
  ['title', 'project'],
  (schema) => schema.optional()
);

const dailyLogSchema = Joi.object({
  reportText: Joi.string().max(3000).required(),
  hoursWorked: Joi.number().min(0).max(24).default(0),
  statusUpdate: Joi.string()
    .valid('todo', 'in-progress', 'review', 'done', 'blocked')
    .optional(),
});

module.exports = { taskSchema, updateTaskSchema, dailyLogSchema };