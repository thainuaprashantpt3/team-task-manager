const Joi = require('joi');

const projectSchema = Joi.object({
  title: Joi.string().max(120).required(),
  description: Joi.string().max(1000).optional().allow(''),
  members: Joi.array().items(Joi.string().length(24)).optional(),
  deadline: Joi.date().greater('now').optional(),
  status: Joi.string()
    .valid('planning', 'active', 'on-hold', 'completed')
    .default('planning'),
});

const updateProjectSchema = projectSchema.fork(
  ['title'],
  (schema) => schema.optional()
);

module.exports = { projectSchema, updateProjectSchema };