import Joi from "joi";
import validate from "express-joi-validation";

export const validates = validate.createValidator({});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).max(20).required(),
});

export const postSchema = Joi.object({
  content: Joi.string().required(),
}).unknown(true);

export const commentSchema = Joi.object({
  text: Joi.string().min(1).max(30).required(),
});

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(20).optional(),
  bio: Joi.string().max(100).optional(),
});
