import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    sku: string;
    category: string;
    description: string;
    minStock: number;
    price: number;
    cost: number;
    unit: string;
    companyId: string;
    supplierId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String },
    minStock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    unit: { type: String, default: 'pieza' },
    companyId: { type: String },
    supplierId: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

export interface CreateProductDTO {
    name: string;
    sku: string;
    category: string;
    description?: string;
    minStock?: number;
    price: number;
    cost: number;
    unit?: string;
    companyId?: string;
    supplierId?: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
