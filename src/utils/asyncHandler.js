const AsyncHandler = (requestHandler) => {
  return function (req, res, next) {
    Promise.resolve(requestHandler(req, res, next))
      .catch((err) => { next(err); });
  };
};

export default AsyncHandler;
