import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  // Validate request body using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};
