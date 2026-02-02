import { Supplier } from '../models/supplier.model.js';

export const getAllSuppliers = async () => await Supplier.find({ isActive: true });
export const createSupplier = async (data: any) => await Supplier.create(data);
export const updateSupplier = async (id: string, data: any) => await Supplier.findByIdAndUpdate(id, data, { new: true });
export const deleteSupplier = async (id: string) => await Supplier.findByIdAndUpdate(id, { isActive: false });
