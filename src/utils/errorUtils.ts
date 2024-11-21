// found this custom error code on stackoverflow
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Middleware to handle errors globally
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    res.status(err.statusCode || 500).json({
        status: 'error',
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error',
    });
};

// Middleware to catch async errors
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction): Promise<void> => {
        return fn(req, res, next).catch(next);
    };
};

