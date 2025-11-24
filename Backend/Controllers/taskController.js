import { Task } from '../Models/TaskMode'

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('username');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createTask = async (req, res) => {
    const task = new Task({
        username: req.body.username,
        Task_Title: req.body.Task_Title,
        Description: req.body.Description,
        Task_Completed: req.body.Task_Completed || false
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('username');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.task = task;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const updateTask = async (req, res) => {
    if (req.body.Task_Title != null) {
        res.task.Task_Title = req.body.Task_Title;
    }
    if (req.body.Description != null) {
        res.task.Description = req.body.Description;
    }
    if (req.body.Task_Completed != null) {
        res.task.Task_Completed = req.body.Task_Completed;
    }
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};