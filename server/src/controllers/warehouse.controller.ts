import { Request, Response } from 'express';
import * as warehouseService from '../services/warehouse.service.js';

export const getWarehouses = async (req: Request, res: Response) => {
    const data = await warehouseService.getAllWarehouses();
    res.json(data);
};

export const createWarehouse = async (req: Request, res: Response) => {
    const data = await warehouseService.createWarehouse(req.body);
    res.status(201).json(data);
};
