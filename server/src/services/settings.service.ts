import { Settings, UpdateSettingsDTO } from '../models/settings.model.js';

export const getSettings = async () => {
    let settings = await Settings.findOne();

    // If no settings exist, create default ones
    if (!settings) {
        settings = await Settings.create({
            themeId: 'light-corporate',
            companyName: 'InventoryPro SaaS'
        });
    }

    return settings;
};

export const updateSettings = async (data: UpdateSettingsDTO) => {
    let settings = await Settings.findOne();

    if (!settings) {
        return await Settings.create(data);
    }

    return await Settings.findOneAndUpdate({}, data, { new: true });
};
