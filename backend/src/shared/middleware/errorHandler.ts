import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode ?? 500;
  console.error(`[error] ${err.message}`, err.stack);
  res.status(statusCode).json({
    error: {
      code: err.code ?? "INTERNAL_ERROR",
      message: err.message ?? "An unexpected error occurred",
    },
  });
}

export function createError(message: string, statusCode: number, code?: string): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}
