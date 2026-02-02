import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'user' | 'manager';
    companyId?: string;
    isActive: boolean;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'manager'], default: 'user' },
    companyId: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
