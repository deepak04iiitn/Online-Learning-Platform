import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req , res , next) => {
    
    const { name, email, password, role } = req.body;

    if(!name || !email || !password)
    {
        return next(errorHandler(400 , 'All fields are required!'));
    }

    if(!['Instructor', 'Student'].includes(role)) 
    {
        return next(errorHandler(400, 'Role must be either Instructor or Student'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)) 
    {
        return next(errorHandler(400, 'Please provide a valid email address'));
    }

    if(password.length < 6) 
    {
        return next(errorHandler(400, 'Password must be at least 6 characters long'));
    }

    try {

        const existingUser = await User.findOne({ email });

        if(existingUser) 
        {
            return next(errorHandler(400, 'User already exists with this email'));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        const { password: pass, ...userResponse } = newUser._doc;
        
        res.status(201).json({
            message: 'Signup successful!',
            user: userResponse
        });

    } catch (error) {
        next(error);
    }

}


export const signin = async (req, res, next) => {

    const { email, password } = req.body;

    if(!email || !password) 
    {
        return next(errorHandler(400, 'All fields are required!'));
    }

    try {
        const validUser = await User.findOne({ email });

        if(!validUser) 
        {
            return next(errorHandler(404, 'Invalid credentials!'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if(!validPassword) 
        {
            return next(errorHandler(400, 'Invalid credentials!'));
        }

        const token = jwt.sign(
            { 
                id: validUser._id,
                role: validUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: pass, ...rest } = validUser._doc;

        res.status(200)
           .cookie('access_token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000, 
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production' 
           })
           .json({
               message: 'Signin successful!',
               user: rest
           });

    } catch (error) {
        next(error);
    }
}


export const signout = async(req , res , next) => {
    try {
        res
          .clearCookie('access_token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          })
          .status(200)
          .json('User has been signed out!');
    } catch (error) {
        next(error);
    }
}