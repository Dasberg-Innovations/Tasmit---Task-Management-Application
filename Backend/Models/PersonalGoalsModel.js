import mongoose from "mongoose";

const SubGoalSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

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
        },
        subGoals: [SubGoalSchema]
    },
    {
        timestamps: true
    }
);

export const Goal = mongoose.model('Goal', GoalSchema, 'Goals');