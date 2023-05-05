const { validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

exports.sanitize = (req, res, next) => {
  // Sanitize query parameters
  for (const [key, value] of Object.entries(req.query)) {
    req.query[key] = sanitizeHtml(value);
  }

  // Sanitize request parameters
  for (const [key, value] of Object.entries(req.params)) {
    req.params[key] = sanitizeHtml(value);
  }

  next();
};

exports.validate = (req, res, next) => {
  // Validate request body using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};
