import Joi from 'joi';

export const createTodoSchema = Joi.object({
    name: Joi.string().required(),
});
