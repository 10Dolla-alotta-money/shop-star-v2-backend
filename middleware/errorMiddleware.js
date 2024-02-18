const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500; // Use error status code if available, else default to 500
  let message = err.message;

  // bad objectId for mongoose server
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found`;
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

// const errorHandler = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;

//   // bad objectId for mongoose server
//   if (err.name === 'CastError' && err.kind === 'ObjectId') {
//     statusCode = 404;
//     message = `Resource not found`;
//   }

//   res.status(statusCode).json({
//     message: message,
//     stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
//   });
// };

export { notFound, errorHandler };
