import mongoose from 'mongoose';
import express from 'express';
import { Task } from '../Models/TaskModel';

const router = express.Router();

router.use(express.json());

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('username');
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Failed to fetch tasks." });
    }
});

router.post('/tasks', async (req, res) => {
    const { username, Task_Title, Description, Task_Completed } = req.body;

    if (!username || !Task_Title) {
        return res.status(400).json({ error: "Username and Task_Title are required." });
    }

    const task = new Task({
        username,
        Task_Title,
        Description,
        Task_Completed: Task_Completed || false,
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Task creation failed. Please try again." });
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('username');
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        console.error("Error fetching task:", err);
        res.status(500).json({ error: "Failed to fetch task." });
    }
});

router.put('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (req.body.Task_Title != null) {
        task.Task_Title = req.body.Task_Title;
    }
    if (req.body.Description != null) {
        task.Description = req.body.Description;
    }
    if (req.body.Task_Completed != null) {
        task.Task_Completed = req.body.Task_Completed;
    }

    try {
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(400).json({ error: err.message });
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Failed to delete task." });
    }
});

export default router;