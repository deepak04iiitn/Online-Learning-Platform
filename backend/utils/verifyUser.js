import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;

    if(!token) 
    {
        return next(errorHandler(401, 'Please sign in to continue!'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) 
        {
            return next(errorHandler(401, 'Please sign in to continue!'));
        }

        req.user = user;
        next();
    });
};


// Role-based authorization middleware
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {

        if(!req.user) 
        {
            return next(errorHandler(401, 'Authentication required'));
        }

        if(!allowedRoles.includes(req.user.role)) 
        {
            return next(errorHandler(403, 'Insufficient permissions for this action'));
        }

        next();
    };
};


// Direct middlewares for specific roles
export const requireInstructor = requireRole(['Instructor']);
export const requireStudent = requireRole(['Student']);
export const requireAnyRole = requireRole(['Instructor', 'Student']);