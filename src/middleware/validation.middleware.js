const validate = (schema) => {
  return async (req, res, next) => {
    const result = await schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
    next();
  };
};

export default validate;
