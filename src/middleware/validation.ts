const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  // Validate request body using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};
