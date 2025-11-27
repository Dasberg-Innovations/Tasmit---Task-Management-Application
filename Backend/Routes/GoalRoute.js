import express from 'express';
import { 
    getAllGoals, 
    createGoal, 
    getGoalsByUser, 
    getGoalById, 
    updateGoal, 
    deleteGoal,
    addSubGoal,
    updateSubGoal,
    deleteSubGoal
} from '../Controllers/GoalController.js';

const router = express.Router();

router.use(express.json());

router.get('/', getAllGoals);
router.get('/user/:userId', getGoalsByUser);
router.post('/', createGoal);
router.get('/:id', getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

router.post('/:goalId/subgoals', addSubGoal);
router.put('/:goalId/subgoals/:subGoalId', updateSubGoal);
router.delete('/:goalId/subgoals/:subGoalId', deleteSubGoal);

export default router;