export const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  const code = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(code).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};
