import express from 'express';
import { 
    getAllTasks, 
    createTask, 
    getTasksByUser,
    getTaskById, 
    updateTask, 
    deleteTask 
} from '../Controllers/taskController.js';

const router = express.Router();

router.use(express.json());

router.get('/', getAllTasks);
router.get('/user/:userId', getTasksByUser);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;