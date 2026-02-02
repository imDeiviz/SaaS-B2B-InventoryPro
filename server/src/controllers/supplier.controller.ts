import { Request, Response } from 'express';
import * as supplierService from '../services/supplier.service.js';

export const getSuppliers = async (req: Request, res: Response) => {
    const data = await supplierService.getAllSuppliers();
    res.json(data);
};

export const createSupplier = async (req: Request, res: Response) => {
    const data = await supplierService.createSupplier(req.body);
    res.status(201).json(data);
};
