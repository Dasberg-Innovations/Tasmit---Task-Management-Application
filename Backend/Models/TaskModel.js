import mongoose from "mongoose";

const TaskSchema = mongoose.Schema(
    {
        username: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        Task_Title: {
            type: String,
            required: true,
            trim: true,
        },
        Description: {
            type: String,
            required: true,
        },
        Task_Completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Task = mongoose.model('Task', TaskSchema, 'Tasks');