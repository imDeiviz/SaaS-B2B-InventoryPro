import { Warehouse } from '../models/warehouse.model.js';

export const getAllWarehouses = async () => await Warehouse.find({ isActive: true });
export const createWarehouse = async (data: any) => await Warehouse.create(data);
export const updateWarehouse = async (id: string, data: any) => await Warehouse.findByIdAndUpdate(id, data, { new: true });
export const deleteWarehouse = async (id: string) => await Warehouse.findByIdAndUpdate(id, { isActive: false });
