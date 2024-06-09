const sendSuccessResponse = (res, message, statusCode, additionalData = {}) => {
  const errorResponse = {
    success: true,
    message,
    ...additionalData,
  };

  return res.status(statusCode).json(errorResponse);
};
export default sendSuccessResponse;
