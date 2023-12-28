import { Request, Response, NextFunction } from "express";
import { User } from "./models/userModel";
import jwt from 'jsonwebtoken';

interface DecodedToken {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    token: string;
}

export const generateToken = (user: User) => {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || "somethingsecret",
        {
            expiresIn: "30d",
        }
    );
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        const decode = jwt.verify(token, process.env.JWT_SECRET || 'somethingsecret');
        req.user = decode as DecodedToken;
        next();
    } else {
        res.status(401).json({ message: 'No Token' });
    }
};