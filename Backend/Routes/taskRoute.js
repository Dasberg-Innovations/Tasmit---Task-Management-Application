import express from 'express';
import { 
    getAllTasks, 
    createTask, 
    getTasksByUser,
    getTaskById, 
    updateTask, 
    deleteTask,
    addSubTask,
    updateSubTask,
    deleteSubTask
} from '../Controllers/taskController.js';

const router = express.Router();

router.use(express.json());

router.get('/', getAllTasks);
router.get('/user/:userId', getTasksByUser);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.post('/:taskId/subtasks', addSubTask);
router.put('/:taskId/subtasks/:subTaskId', updateSubTask);
router.delete('/:taskId/subtasks/:subTaskId', deleteSubTask);

export default router;