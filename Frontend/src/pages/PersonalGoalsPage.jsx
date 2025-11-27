import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineDone, MdModeEditOutline, MdAdd, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../components/AuthContext';

const PersonalGoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [newGoalAim, setNewGoalAim] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editedGoalAim, setEditedGoalAim] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [newSubGoalTitle, setNewSubGoalTitle] = useState('');
    const [addingSubGoalId, setAddingSubGoalId] = useState(null);
    const [expandedGoals, setExpandedGoals] = useState({});
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchGoals();
        }
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
        if (!newGoalAim.trim() || !newDescription.trim() || !user) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5555/goals', {
                userId: user.id,
                Goal_Aim: newGoalAim,
                Description: newDescription,
                Goal_Completed: false
            });
            
            setGoals(prevGoals => [...prevGoals, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error creating goal:', error);
            alert(`Failed to add goal: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const updateGoal = async (id) => {
        if (!editedGoalAim.trim() || !editedDescription.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5555/goals/${id}`, {
                Goal_Aim: editedGoalAim,
                Description: editedDescription
            });

            setGoals(goals.map((g) => g._id === id ? response.data : g));
            setEditingGoalId(null);
            setEditedGoalAim('');
            setEditedDescription('');
        } catch (error) {
            console.error('Error updating goal:', error);
            alert('Failed to update goal. Please try again.');
        }
    };

    const deleteGoal = async (id) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5555/goals/${id}`);
            setGoals(goals.filter((g) => g._id !== id));
        } catch (error) {
            console.error('Error deleting goal:', error);
            alert('Failed to delete goal. Please try again.');
        }
    };

    const addSubGoal = async (goalId) => {
        if (!newSubGoalTitle.trim()) {
            alert('Please enter a subgoal title');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5555/goals/${goalId}/subgoals`, {
                title: newSubGoalTitle
            });

            setGoals(goals.map((g) => g._id === goalId ? response.data : g));
            setNewSubGoalTitle('');
            setAddingSubGoalId(null);
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

            setGoals(goals.map((g) => g._id === goalId ? response.data : g));
        } catch (error) {
            console.error('Error updating subgoal:', error);
        }
    };

    const deleteSubGoal = async (goalId, subGoalId) => {
        if (!window.confirm('Are you sure you want to delete this subgoal?')) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5555/goals/${goalId}/subgoals/${subGoalId}`);
            setGoals(goals.map((g) => g._id === goalId ? response.data : g));
        } catch (error) {
            console.error('Error deleting subgoal:', error);
            alert('Failed to delete subgoal. Please try again.');
        }
    };

    const toggleExpandGoal = (goalId) => {
        setExpandedGoals(prev => ({
            ...prev,
            [goalId]: !prev[goalId]
        }));
    };

    const calculateProgress = (goal) => {
        if (!goal.subGoals || goal.subGoals.length === 0) return 0;
        const completed = goal.subGoals.filter(sub => sub.completed).length;
        return (completed / goal.subGoals.length) * 100;
    };

    const resetForm = () => {
        setNewGoalAim('');
        setNewDescription('');
        setIsModalOpen(false);
    };

    const startEditing = (goal) => {
        setEditingGoalId(goal._id);
        setEditedGoalAim(goal.Goal_Aim);
        setEditedDescription(goal.Description);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-4">
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Goal'}
            </button>

            <div className="flex flex-col space-y-4 w-full">
                {goals.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No goals yet. Add your first goal!
                    </div>
                ) : (
                    goals.map(goal => (
                        <div key={goal._id} className="flex flex-col bg-white rounded-lg shadow-md p-4 w-full">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleExpandGoal(goal._id)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            {expandedGoals[goal._id] ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                        </button>
                                        <span className={`text-lg font-semibold ${goal.Goal_Completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                            {goal.Goal_Aim}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600 mt-1 ml-7">
                                        {goal.Description}
                                    </span>
                                    
                                    {/* Progress Bar */}
                                    {goal.subGoals && goal.subGoals.length > 0 && (
                                        <div className="mt-2 ml-7">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Progress</span>
                                                <span>{Math.round(calculateProgress(goal))}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${calculateProgress(goal)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-x-2 ml-4">
                                    <button
                                        className="p-2 text-blue-500 hover:text-blue-700 rounded-lg transition-colors"
                                        onClick={() => startEditing(goal)}
                                    >
                                        <MdModeEditOutline />
                                    </button>
                                    <button
                                        onClick={() => deleteGoal(goal._id)}
                                        className="p-2 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {/* Subgoals Section */}
                            {expandedGoals[goal._id] && (
                                <div className="mt-4 ml-7 border-t pt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium text-gray-700">Subgoals</h4>
                                        <button
                                            onClick={() => setAddingSubGoalId(goal._id)}
                                            className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                                        >
                                            <MdAdd size={16} />
                                            Add Subgoal
                                        </button>
                                    </div>

                                    {/* Add Subgoal Form */}
                                    {addingSubGoalId === goal._id && (
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSubGoalTitle}
                                                onChange={(e) => setNewSubGoalTitle(e.target.value)}
                                                placeholder="Enter subgoal title"
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => addSubGoal(goal._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAddingSubGoalId(null);
                                                    setNewSubGoalTitle('');
                                                }}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md text-sm transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    {/* Subgoals List */}
                                    <div className="space-y-2">
                                        {goal.subGoals && goal.subGoals.length > 0 ? (
                                            goal.subGoals.map((subGoal) => (
                                                <div key={subGoal._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <button
                                                            onClick={() => toggleSubGoal(goal._id, subGoal._id, subGoal.completed)}
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                                subGoal.completed 
                                                                    ? 'bg-green-500 border-green-500 text-white' 
                                                                    : 'border-gray-300 hover:border-green-500'
                                                            }`}
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
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-400 py-4">
                                                No subgoals yet. Add your first subgoal!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Goal Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Add New Goal</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={loading}
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={addGoal} className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Goal Title
                                </label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="text"
                                    value={newGoalAim}
                                    onChange={(e) => setNewGoalAim(e.target.value)}
                                    placeholder="Enter goal title"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Enter goal description"
                                    rows="3"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
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
                    </div>
                </div>
            )}

            {/* Edit Goal Modal */}
            {editingGoalId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Edit Goal</h2>
                            <button 
                                onClick={() => setEditingGoalId(null)} 
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateGoal(editingGoalId);
                        }} className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Goal Title
                                </label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="text"
                                    value={editedGoalAim}
                                    onChange={(e) => setEditedGoalAim(e.target.value)}
                                    placeholder="Enter goal title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    placeholder="Enter goal description"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingGoalId(null)}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalGoalsPage;