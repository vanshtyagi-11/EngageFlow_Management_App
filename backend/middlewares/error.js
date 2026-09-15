const notFound = (req, _res, next) =>
  next(
    Object.assign(new Error(`Route not found: ${req.method} ${req.path}`), {
      statusCode: 404,
    })
  );

const errorHandler = (error, _req, res, _next) => {
  const status =
    error.statusCode ||
    (error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500);
  const message =
    error.code === 11000
      ? "A record with these unique values already exists"
      : error.message;
  res
    .status(status)
    .json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
};

module.exports = { notFound, errorHandler };
