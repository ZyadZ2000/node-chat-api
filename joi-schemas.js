const Joi = require("joi");

const validRequests = ["group", "private", "contact"];

exports.jwtSchema = Joi.string().required();
exports.usernameSchema = Joi.string().min(3).max(30);
exports.mongoIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
exports.chatNameSchema = Joi.string().min(3).max(30);
exports.messageContentSchema = Joi.string().min(1).max(300);
exports.requestTypeSchema = Joi.string().valid(...validRequests);
