import { Goal } from '../Models/GoalModel.js'; // Updated import
import { User } from '../Models/UserLoginModel.js';

const getAllGoals = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};

        if (userId) {
            query.user = userId;
        }

        const goals = await Goal.find(query).populate('user', 'username email');
        res.json(goals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createGoal = async (req, res) => {
    try {
        const { userId, Goal_Aim, Description, Goal_Completed } = req.body;

        if (!userId || !Goal_Aim || !Description) {
            return res.status(400).json({
                message: 'User ID, Goal_Aim, and Description are required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const goal = new Goal({
            user: userId,
            Goal_Aim,
            Description,
            Goal_Completed: Goal_Completed || false
        });

        const newGoal = await goal.save();
        await newGoal.populate('user', 'username email');
        res.status(201).json(newGoal);
    } catch (err) {
        console.error('Error creating goal:', err);
        res.status(400).json({ message: err.message });
    }
};

const getGoalsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const goals = await Goal.find({ user: userId }).populate('user', 'username email');
        res.json(goals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id).populate('user', 'username email');
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json(goal);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (req.body.Goal_Aim != null) goal.Goal_Aim = req.body.Goal_Aim;
        if (req.body.Description != null) goal.Description = req.body.Description;
        if (req.body.Goal_Completed != null) goal.Goal_Completed = req.body.Goal_Completed;

        const updatedGoal = await goal.save();
        await updatedGoal.populate('user', 'username email');
        res.json(updatedGoal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        await Goal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Goal deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllGoals, createGoal, getGoalsByUser, getGoalById, updateGoal, deleteGoal
};