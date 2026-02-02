import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const me = async (req: Request, res: Response) => {
    // In a real app, verify JWT header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
