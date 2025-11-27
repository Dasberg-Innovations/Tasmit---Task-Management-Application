import mongoose from "mongoose";

const UserSettingsSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        theme: {
            type: String,
            default: "default"
        }
    },
    {
        timestamps: true,
        collection: 'UserSettings'
    }
);

export const UserSettings = mongoose.model('UserSettings', UserSettingsSchema);