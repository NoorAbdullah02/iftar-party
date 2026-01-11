import type { Request, Response } from 'express'
import * as queries from "../db/queries"

import { RegisterCheckValid } from '../validations/validinputs'

import { LoginValidationSchema } from '../validations/validinputs'

import { env } from '../config/env';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';


export const registerUser = async (req: Request, res: Response) => {
    try {

        const validationResult = await RegisterCheckValid.safeParseAsync(req.body);

        if (!validationResult.success) {
            return res.status(400).json({ message: "Invalid input", errors: validationResult.error.issues });
        }

        const { name, email, password } = validationResult.data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await queries.createUser({
            name,
            email,
            password: hashedPassword
        })
        return res.status(201).json({ message: "User registered successfully", user });

    } catch (error: any) {
        console.error("Error in registerUser:", error);
        if (error?.message?.includes('already exists')) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

export const loginUser = async (req: Request, res: Response) => {
    try {
        console.log('loginUser body:', req.body);
        const validationResult = await LoginValidationSchema.safeParseAsync(req.body);
        if (!validationResult.success) {
            console.warn('login validation failed:', validationResult.error.issues);
            return res.status(400).json({ message: "Invalid input", errors: validationResult.error.issues });
        }
        const { email, password } = validationResult.data;

        const check = await queries.getUserByEmail(email);

        if (!check) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, check.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({
            id: check.id,
            email: check.email
        }, env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            // secure: env.NODE_ENV === 'production',
            sameSite: 'lax', // allow sending cookie on top-level navigations in dev
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const checkEmailExists = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await queries.getUserByEmail(email);

        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Do not return sensitive fields such as password
        const { password, ...safeUser } = user;
        return res.status(200).json({ user: safeUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            // secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}   