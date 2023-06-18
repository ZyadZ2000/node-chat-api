import Joi from "joi";

const validRequests = ["group", "private", "contact"];

export const jwtSchema = Joi.string().required();
export const usernameSchema = Joi.string().min(3).max(30);
export const mongoIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
export const chatNameSchema = Joi.string().min(3).max(30);
export const messageContentSchema = Joi.string().min(1).max(300);
export const requestTypeSchema = Joi.string().valid(...validRequests);
