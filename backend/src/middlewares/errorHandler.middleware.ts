import { ErrorRequestHandler, Response } from "express";
import { ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";
import { MulterError } from "multer";
import { ErrorCodeEnum } from "../enums/error-code.enum";

function formatZodError(res: Response, error: ZodError) {
  const errors = error.issues.map((iss) => ({
    field: iss.path.join("."), // e.g. "email" or "user.password"
    message: iss.message,
  }));

  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors,
    errorCode: "VALIDATION_ERROR",
  });
}

const handleMulterError = (error: MulterError) => {
  const messages = {
    LIMIT_UNEXPECTED_FILE: "Invalid file field name. Please use 'file'",
    LIMIT_FILE_SIZE: "File size exceeds the limit",
    LIMIT_FILE_COUNT: "Too many files uploaded",
    default: "File upload error",
  };

  return {
    status: HTTPSTATUS.BAD_REQUEST,
    message: messages[error.code as keyof typeof messages] || messages.default,
    error: error.message,
  };
};


export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  console.error("Error occurred on PATH:", req.path, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }
  if (error instanceof MulterError) {
    const { status, message, error: err } = handleMulterError(error);
    return res.status(status).json({
      message,
      error: err,
      errorCode: ErrorCodeEnum.FILE_UPLOAD_ERROR
    });
  }
  
  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
    errorCode: "INTERNAL_ERROR",
  });
};
