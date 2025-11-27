import mongoose from "mongoose";

const GoalSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        Goal_Aim: {
            type: String,
            required: true,
            trim: true,
        },
        Description: {
            type: String,
            required: true,
        },
        Goal_Completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Goal = mongoose.model('Goal', GoalSchema, 'Goals');