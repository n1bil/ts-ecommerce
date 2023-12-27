import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/userModel';
import { generateToken } from '../utils';

export const userRouter = express.Router();

// POST /api/users/signin
userRouter.post('/signin', asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            });
            return;
        }
    }
    res.status(401).json({ message: 'Invalid email or password' });
}));

userRouter.post('/signup', asyncHandler(async (req: Request, res: Response) => {
    const user: User = await UserModel.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    });
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
    });
}));