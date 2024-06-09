
const sendErrorResponse = (res, message, statusCode, additionalData={}) => {
    const errorResponse = {
        success: false,
        message,
        ...additionalData,
      };
    
      return res.status(statusCode).json(errorResponse);
};
export default sendErrorResponse