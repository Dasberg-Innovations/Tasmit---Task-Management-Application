import { Task } from '../Models/TaskModel.js';
import { User } from '../Models/UserLoginModel.js';

const getAllTasks = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};

        if (userId) {
            query.user = userId;
        }

        const tasks = await Task.find(query).populate('user', 'username email');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createTask = async (req, res) => {
    try {
         const { userId, Task_Title, Description, Task_Completed, Due_Date, Priority, Urgency, SubTasks } = req.body;

        if (!userId || !Task_Title || !Description) {
            return res.status(400).json({ 
                message: 'User ID, Task_Title, and Description are required' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let dueDate;
        if (Due_Date) {
            const parsedDate = new Date(Due_Date);
            dueDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
        } else {
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
            dueDate = new Date(oneWeekFromNow.getFullYear(), oneWeekFromNow.getMonth(), oneWeekFromNow.getDate());
        }

        const task = new Task({
            user: userId,
            Task_Title,
            Description,
            Task_Completed: Task_Completed || false,
            Due_Date: dueDate,
            Priority: Priority || 'Medium',
            Urgency: Urgency || 'Medium',
            SubTasks: SubTasks || [] 
        });

        const newTask = await task.save();
        await newTask.populate('user', 'username email');
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(400).json({ message: err.message });
    }
};

const getTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.find({ user: userId }).populate('user', 'username email');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('user', 'username email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.body.Task_Title != null) task.Task_Title = req.body.Task_Title;
        if (req.body.Description != null) task.Description = req.body.Description;
        if (req.body.Task_Completed != null) task.Task_Completed = req.body.Task_Completed;
        if (req.body.Due_Date != null && !isNaN(new Date(req.body.Due_Date))) {
            task.Due_Date = new Date(req.body.Due_Date);
        }
        if (req.body.Priority != null) task.Priority = req.body.Priority;
        if (req.body.Urgency != null) task.Urgency = req.body.Urgency;

        const updatedTask = await task.save();
        await updatedTask.populate('user', 'username email');
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addSubTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Subtask title is required' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const newSubTask = {
            title,
            completed: false
        };

        task.SubTasks.push(newSubTask);
        const updatedTask = await task.save();
        await updatedTask.populate('user', 'username email');
        
        res.json({
            ...updatedTask.toObject(),
            SubTasks: updatedTask.SubTasks
        });
    } catch (err) {
        console.error('Error adding subtask:', err);
        res.status(400).json({ message: err.message });
    }
};

const updateSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params;
        const { completed, title } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const SubTask = task.SubTasks.id(subTaskId);
        if (!SubTask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        if (completed !== undefined) SubTask.completed = completed;
        if (title !== undefined) SubTask.title = title;

        const updatedTask = await task.save();
        await updatedTask.populate('user', 'username email');
        res.json(updatedTask);
    } catch (err) {
        console.error('Error updating subtask:', err);
        res.status(400).json({ message: err.message });
    }
};

const deleteSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const subTaskIndex = task.SubTasks.findIndex(subTask => subTask._id.toString() === subTaskId);
        if (subTaskIndex === -1) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        task.SubTasks.splice(subTaskIndex, 1);
        
        const updatedTask = await task.save();
        await updatedTask.populate('user', 'username email');
        res.json(updatedTask);
    } catch (err) {
        console.error('Error deleting subtask:', err);
        res.status(400).json({ message: err.message });
    }
};

export {getAllTasks, createTask, getTasksByUser, getTaskById, updateTask, deleteTask, addSubTask, updateSubTask, deleteSubTask
};