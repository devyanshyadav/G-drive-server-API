import sendErrorResponse from "../utils/sendErrorResponse.js";

const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    return sendErrorResponse(res, err.errors[0].message, 400);
  }
};

export default validate;
