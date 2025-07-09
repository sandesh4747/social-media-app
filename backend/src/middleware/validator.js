import Joi from "joi";
import validate from "express-joi-validation";

export const validates = validate.createValidator({});

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
  password: Joi.string().trim().min(6).max(20).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password must be at most 20 characters long",
  }),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 20 characters long",
  }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
  password: Joi.string().trim().min(6).max(20).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password must be at most 20 characters long",
  }),
});

export const postSchema = Joi.object({
  content: Joi.string().required().messages({
    "any.required": "Post content is required",
    "string.empty": "Post content is required",
  }),
}).unknown(true);

export const commentSchema = Joi.object({
  text: Joi.string().min(1).max(30).required().messages({
    "string.empty": "Comment cannot be empty",
    "string.min": "Comment must be at least 1 character",
    "string.max": "Comment must not exceed 30 characters",
    "any.required": "Comment is required",
  }),
});

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(20).optional().messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must not exceed 20 characters",
  }),
  bio: Joi.string().max(100).optional().messages({
    "string.max": "Bio must not exceed 100 characters",
  }),
}).unknown(true);

export const onboardSchema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 20 characters long",
  }),
  bio: Joi.string().max(100).required().messages({
    "string.empty": "Bio is required",
    "any.required": "Bio is required",
    "string.max": "Bio must not exceed 100 characters",
  }),
});
