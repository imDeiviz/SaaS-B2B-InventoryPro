import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSettings extends Document {
    themeId: string;
    customColors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    companyName: string;
}

const SettingsSchema: Schema = new Schema({
    themeId: { type: String, default: 'default' },
    customColors: {
        primary: { type: String, default: '#2563eb' },
        secondary: { type: String, default: '#64748b' },
        accent: { type: String, default: '#f59e0b' }
    },
    companyName: { type: String, default: 'InventoryPro SaaS' }
}, { timestamps: true });

export const Settings = mongoose.model<IGlobalSettings>('Settings', SettingsSchema);

export type UpdateSettingsDTO = Partial<Omit<IGlobalSettings, keyof Document>>;
