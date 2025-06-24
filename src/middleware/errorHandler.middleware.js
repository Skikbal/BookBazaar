import { NODE_ENV } from "../config/envConfig.js";
const errorHandler = async (err, req, res, next) => {
  const isProduction = NODE_ENV === "production";
  const response = {
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal server error",
    errors: err.errors || [],
    stack: isProduction ? null : err.stack,
  };
  return res.status(err.statusCode || 500).json(response);
};

export default errorHandler;
