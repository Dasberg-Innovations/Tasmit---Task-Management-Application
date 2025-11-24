import express from 'express';
import { getAllTasks, createTask, getTask, updateTask, deleteTask } from '../Controllers/taskController';

const router = express.Router();

router.get('/', getAllTasks);

router.post('/', createTask);

router.get('/:id', getTask, (req, res) => {
    res.json(res.task);
});

router.put('/:id', getTask, updateTask);

router.delete('/:id', getTask, deleteTask);

export default router;