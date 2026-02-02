import mongoose, { Schema, Document } from 'mongoose';

export interface IMovement extends Document {
    productId: string;
    warehouseId: string;
    warehouseDestinationId?: string;
    type: 'entrada' | 'salida' | 'ajuste' | 'transferencia';
    quantity: number;
    unitCost?: number;
    userId: string;
    reason: string;
    reference?: string;
    notes?: string;
    date: Date;
    companyId: string;
}

const MovementSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    warehouseDestinationId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    type: { type: String, enum: ['entrada', 'salida', 'ajuste', 'transferencia'], required: true },
    quantity: { type: Number, required: true },
    unitCost: { type: Number },
    userId: { type: String },
    reason: { type: String },
    reference: { type: String },
    notes: { type: String },
    date: { type: Date, default: Date.now },
    companyId: { type: String }
}, { timestamps: true });

export const Movement = mongoose.model<IMovement>('Movement', MovementSchema);
