import { Request, Response } from 'express';
import * as settingsService from '../services/settings.service.js';

export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.updateSettings(req.body);
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: 'Error updating settings' });
    }
};
