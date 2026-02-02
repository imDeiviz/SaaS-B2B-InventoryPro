import { Movement } from '../models/movement.model.js';

export const getAllMovements = async () => await Movement.find();
export const createMovement = async (data: any) => await Movement.create(data);
export const getMovementsByProduct = async (productId: string) => await Movement.find({ productId });
