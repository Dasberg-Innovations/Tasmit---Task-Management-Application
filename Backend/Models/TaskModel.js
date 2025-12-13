import mongoose from "mongoose";

const SubTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const TaskSchema = new mongoose.Schema(
    {
        user: {
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
        },
        Due_Date: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        },
        Priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        Urgency: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        SubTasks: [SubTaskSchema] 
    },
    {
        timestamps: true
    }
);

export const Task = mongoose.model('Task', TaskSchema, 'Tasks');