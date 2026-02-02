import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxId: string;
    companyId: string;
    isActive: boolean;
    createdAt: Date;
}

const SupplierSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    taxId: { type: String },
    companyId: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);
