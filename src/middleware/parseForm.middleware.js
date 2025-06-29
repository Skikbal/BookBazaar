import ApiError from "../utils/apiError.js";
const parseForm = (fields) => {
  return (req, res, next) => {
    fields.forEach((field) => {
      if (req.body[field]) {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        }
        catch (error) {
          next(new ApiError(400, "Invalid JSON", error));
        }
      }
    });
    next();
  };
};

export default parseForm;
