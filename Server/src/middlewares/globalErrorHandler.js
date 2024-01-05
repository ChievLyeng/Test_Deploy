const AppError = require("../utils/appError");

// send error for development
const developmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}; 

//send error for prouduction
const productionError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status || "error",
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// mongo erro
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : "unknown"; // simplet string to get the array of key

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    developmentError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") {
      err = handleCastErrorDB(err);
    }

    if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }

    if (err.name === "ValidationError") {
      err = handleValidationErrorDB(err);
    }
    return productionError(err, res);
  }
};

module.exports = globalErrorHandler;