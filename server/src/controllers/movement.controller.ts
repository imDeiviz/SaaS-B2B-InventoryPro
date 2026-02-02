import { Request, Response } from 'express';
import * as movementService from '../services/movement.service.js';

export const getMovements = async (req: Request, res: Response) => {
    const data = await movementService.getAllMovements();
    res.json(data);
};

export const createMovement = async (req: Request, res: Response) => {
    const data = await movementService.createMovement(req.body);
    res.status(201).json(data);
};
