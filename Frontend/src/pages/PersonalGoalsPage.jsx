import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { MdOutlineDone, MdAdd, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../components/AuthContext';

const Modal = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        type="button"
                    >
                        <IoClose size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Move AddGoalForm outside of PersonalGoalsPage
const AddGoalForm = ({ newGoal, loading, onNewGoalChange, onAddGoal, onCancel }) => (
    <form onSubmit={onAddGoal} className="flex flex-col space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
            <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                name="aim"
                value={newGoal.aim}
                onChange={onNewGoalChange}
                placeholder="Enter goal title"
                required
                disabled={loading}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="description"
                value={newGoal.description}
                onChange={onNewGoalChange}
                placeholder="Enter goal description"
                rows="3"
                required
                disabled={loading}
            />
        </div>
        <div className="flex gap-2 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
                disabled={loading}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Goal'}
            </button>
        </div>
    </form>
);

// Move EditGoalForm outside of PersonalGoalsPage as well for consistency
const EditGoalForm = ({ editGoal, onEditGoalChange, onUpdateGoal, onCancel }) => (
    <form onSubmit={(e) => {
        e.preventDefault();
        onUpdateGoal();
    }} className="flex flex-col space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
            <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                value={editGoal.aim}
                onChange={(e) => onEditGoalChange('aim', e.target.value)}
                placeholder="Enter goal title"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editGoal.description}
                onChange={(e) => onEditGoalChange('description', e.target.value)}
                placeholder="Enter goal description"
                rows="3"
                required
            />
        </div>
        <div className="flex gap-2 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
                Update Goal
            </button>
        </div>
    </form>
);

const PersonalGoalsPage = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ aim: '', description: '' });
    const [editGoal, setEditGoal] = useState({ id: null, aim: '', description: '' });
    const [newSubGoal, setNewSubGoal] = useState({ goalId: null, title: '' });
    const [expandedGoals, setExpandedGoals] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        user && fetchGoals();
    }, [user]);

    const fetchGoals = async () => {
        try {
            const response = await axios.get(`http://localhost:5555/goals/user/${user.id}`);
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    };

    const addGoal = async (e) => {
        e.preventDefault();
        if (!newGoal.aim.trim() || !newGoal.description.trim() || !user) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5555/goals', {
                userId: user.id,
                Goal_Aim: newGoal.aim,
                Description: newGoal.description,
                Goal_Completed: false
            });

            setGoals(prev => [...prev, response.data]);
            setNewGoal({ aim: '', description: '' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating goal:', error);
            alert(`Failed to add goal: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleGoal = async (id) => {
        try {
            const goal = goals.find(g => g._id === id);
            const response = await axios.put(`http://localhost:5555/goals/${id}`, {
                Goal_Completed: !goal.Goal_Completed
            });

            setGoals(goals.map(g => g._id === id ? response.data : g));
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const updateGoal = async () => {
        if (!editGoal.aim.trim() || !editGoal.description.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5555/goals/${editGoal.id}`, {
                Goal_Aim: editGoal.aim,
                Description: editGoal.description
            });

            setGoals(goals.map(g => g._id === editGoal.id ? response.data : g));
            setEditGoal({ id: null, aim: '', description: '' });
        } catch (error) {
            console.error('Error updating goal:', error);
            alert('Failed to update goal. Please try again.');
        }
    };

    const deleteGoal = async (id) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;

        try {
            await axios.delete(`http://localhost:5555/goals/${id}`);
            setGoals(goals.filter(g => g._id !== id));
        } catch (error) {
            console.error('Error deleting goal:', error);
            alert('Failed to delete goal. Please try again.');
        }
    };

    const addSubGoal = async (goalId) => {
        if (!newSubGoal.title.trim()) {
            alert('Please enter a subgoal title');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5555/goals/${goalId}/subgoals`, {
                title: newSubGoal.title
            });

            setGoals(goals.map(g => g._id === goalId ? response.data : g));
            setNewSubGoal({ goalId: null, title: '' });
        } catch (error) {
            console.error('Error adding subgoal:', error);
            alert('Failed to add subgoal. Please try again.');
        }
    };

    const toggleSubGoal = async (goalId, subGoalId, completed) => {
        try {
            const response = await axios.put(`http://localhost:5555/goals/${goalId}/subgoals/${subGoalId}`, {
                completed: !completed
            });

            setGoals(goals.map(g => g._id === goalId ? response.data : g));
        } catch (error) {
            console.error('Error updating subgoal:', error);
        }
    };

    const deleteSubGoal = async (goalId, subGoalId) => {
        if (!window.confirm('Are you sure you want to delete this subgoal?')) return;

        try {
            const response = await axios.delete(`http://localhost:5555/goals/${goalId}/subgoals/${subGoalId}`);
            setGoals(goals.map(g => g._id === goalId ? response.data : g));
        } catch (error) {
            console.error('Error deleting subgoal:', error);
            alert('Failed to delete subgoal. Please try again.');
        }
    };

    const calculateProgress = (goal) => {
        if (!goal.subGoals?.length) return 0;
        const completed = goal.subGoals.filter(sub => sub.completed).length;
        return (completed / goal.subGoals.length) * 100;
    };

    const toggleExpandGoal = (goalId) => {
        setExpandedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }));
    };

    const handleNewGoalChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewGoal((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleEditGoalChange = useCallback((field, value) => {
        setEditGoal((prev) => ({ ...prev, [field]: value }));
    }, []);

    const GoalItem = ({ goal }) => {
        const progress = calculateProgress(goal);

        const handleSubGoalChange = (value) => {
            setNewSubGoal(prev => ({ ...prev, title: value }));
        };

        const handleAddSubGoal = (goalId) => {
            if (newSubGoal.title.trim()) {
                addSubGoal(goalId);
            }
        };

        return (
            <div key={goal._id} className="flex flex-col bg-white rounded-lg shadow-md p-4 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleExpandGoal(goal._id)}
                                className="text-gray-500 hover:text-gray-700"
                                type="button"
                            >
                                {expandedGoals[goal._id] ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                            </button>
                            <button
                                onClick={() => toggleGoal(goal._id)}
                                className={`h-6 w-6 border rounded-full flex items-center justify-center transition-colors ${goal.Goal_Completed
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300 hover:border-green-500"
                                    }`}
                                type="button"
                            >
                                {goal.Goal_Completed && <MdOutlineDone className="text-white" size={14} />}
                            </button>
                            <span className={`text-lg font-semibold ${goal.Goal_Completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {goal.Goal_Aim}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600 mt-1 ml-7">{goal.Description}</span>

                        {goal.subGoals?.length > 0 && (
                            <div className="mt-2 ml-7">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-x-2 ml-4">
                        <button
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg transition-colors"
                            onClick={() => setEditGoal({ id: goal._id, aim: goal.Goal_Aim, description: goal.Description })}
                            type="button"
                        >
                            <FaEdit size={18} />
                        </button>
                        <button
                            onClick={() => deleteGoal(goal._id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                            type="button"
                        >
                            <FaTrashAlt size={16} />
                        </button>
                    </div>
                </div>

                {expandedGoals[goal._id] && (
                    <div className="p-2 mt-4 ml-7 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-700">Subgoals</h4>
                            <button
                                onClick={() => setNewSubGoal(prev => prev.goalId === goal._id ?
                                    { goalId: null, title: '' } :
                                    { goalId: goal._id, title: '' })}
                                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm flex items-center gap-1"
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }}
                                type="button"
                            >
                                {newSubGoal.goalId === goal._id ? 'Cancel' : 'Add Subgoal'}
                            </button>
                        </div>

                        {newSubGoal.goalId === goal._id && (
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newSubGoal.title}
                                    onChange={(e) => handleSubGoalChange(e.target.value)}
                                    placeholder="Enter subgoal title"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSubGoal(goal._id);
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => handleAddSubGoal(goal._id)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                                    type="button"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setNewSubGoal({ goalId: null, title: '' })}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md text-sm transition-colors"
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {goal.subGoals?.length > 0 ? (
                                goal.subGoals.map((subGoal) => (
                                    <div key={subGoal._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <button
                                                onClick={() => toggleSubGoal(goal._id, subGoal._id, subGoal.completed)}
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${subGoal.completed
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300 hover:border-green-500'
                                                    }`}
                                                type="button"
                                            >
                                                {subGoal.completed && <MdOutlineDone size={14} />}
                                            </button>
                                            <span className={`flex-1 ${subGoal.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {subGoal.title}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteSubGoal(goal._id, subGoal._id)}
                                            className="text-red-400 hover:text-red-600 transition-colors ml-2"
                                            type="button"
                                        >
                                            <FaTrashAlt size={14} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4">No subgoals yet. Add your first subgoal!</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen p-12 bg-[#7E7F83]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Your Active Goals</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm flex items-center justify-center gap-1"
                    style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white'
                    }}
                    disabled={loading}
                    title="Add New Goal"
                    type="button"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                    ) : (
                        <MdAdd size={16} />
                    )}
                    Add Goal
                </button>
            </div>

            <div className="flex flex-col space-y-4 w-full">
                {goals.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <MdAdd className="mx-auto mb-3 text-gray-400" size={48} />
                        <p className="text-lg font-medium mb-2">No goals yet</p>
                        <p className="text-sm">Click the <span className="font-semibold">+</span> button above to add your first goal!</p>
                    </div>
                ) : (
                    goals.map(goal => <GoalItem key={goal._id} goal={goal} />)
                )}
            </div>
            <Modal
                title="Add New Goal"
                isOpen={isModalOpen}
                onClose={() => !loading && setIsModalOpen(false)}
            >
                <AddGoalForm
                    newGoal={newGoal}
                    loading={loading}
                    onNewGoalChange={handleNewGoalChange}
                    onAddGoal={addGoal}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            <Modal
                title="Edit Goal"
                isOpen={!!editGoal.id}
                onClose={() => setEditGoal({ id: null, aim: '', description: '' })}
            >
                <EditGoalForm
                    editGoal={editGoal}
                    onEditGoalChange={handleEditGoalChange}
                    onUpdateGoal={updateGoal}
                    onCancel={() => setEditGoal({ id: null, aim: '', description: '' })}
                />
            </Modal>
        </div>
    );
};

export default PersonalGoalsPage;