import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
    name: string;
    code: string;
    address: string;
    city: string;
    companyId: string;
    responsibleIds: string[];
    capacity: number;
    isActive: boolean;
    createdAt: Date;
}

const WarehouseSchema: Schema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    address: { type: String },
    city: { type: String },
    companyId: { type: String },
    responsibleIds: [{ type: String }],
    capacity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
