import React, { useState, useEffect } from 'react';
import { MdOutlineDone, MdModeEditOutline, MdAdd, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const TaskManager = () => {
    const [new_task, setNewTask] = useState('');
    const [new_description, setNewDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editing_task, setEditingTask] = useState(null);
    const [edited_text, setEditedText] = useState('');
    const [edited_description, setEditedDescription] = useState('');
    const { user } = useAuth();
    const [due_date, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [urgency, setUrgency] = useState('Medium');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
    const [addingSubTaskId, setAddingSubTaskId] = useState(null);
    const [expandedTasks, setExpandedTasks] = useState({});

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:5555/tasks/user/${user.id}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!new_task || !new_description || !user) return;

        setLoading(true);
        try {
            let due_date_to_send = due_date ? new Date(due_date + 'T00:00:00').toISOString() : null;

            const response = await axios.post('http://localhost:5555/tasks', {
                userId: user.id,
                Task_Title: new_task,
                Description: new_description,
                Task_Completed: false,
                Due_Date: due_date_to_send,
                Priority: priority,
                Urgency: urgency
            });
            setTasks([...tasks, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error creating task:', error);
            alert(`Failed to add task: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const response = await axios.put(`http://localhost:5555/tasks/${id}`, {
                Task_Completed: !task.Task_Completed
            });

            setTasks(tasks.map((t) => t._id === id ? response.data : t));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5555/tasks/${id}`);
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        setEditedText(task.Task_Title);
        setEditedDescription(task.Description);
    };

    const saveEdit = async (id) => {
        if (!edited_text.trim() || !edited_description.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5555/tasks/${id}`, {
                Task_Title: edited_text,
                Description: edited_description
            });

            setTasks(tasks.map((t) => t._id === id ? response.data : t));
            setEditingTask(null);
            setEditedText('');
            setEditedDescription('');
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    };

    const resetForm = () => {
        setNewTask('');
        setNewDescription('');
        setDueDate('');
        setPriority('Medium');
        setUrgency('Medium');
        setIsModalOpen(false);
    };

    const addSubTask = async (taskId) => {
        if (!newSubTaskTitle.trim()) {
            alert('Please enter a subtask title');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5555/tasks/${taskId}/subtasks`, {
                title: newSubTaskTitle
            });

            setTasks(tasks.map((t) => t._id === taskId ? response.data : t));
            setNewSubTaskTitle('');
            setAddingSubTaskId(null);
        } catch (error) {
            console.error('Error adding subtask:', error);
            alert('Failed to add subtask. Please try again.');
        }
    };

    const toggleSubTask = async (taskId, subTaskId, completed) => {
        try {
            const response = await axios.put(`http://localhost:5555/tasks/${taskId}/subtasks/${subTaskId}`, {
                completed: !completed
            });

            setTasks(tasks.map((t) => t._id === taskId ? response.data : t));
        } catch (error) {
            console.error('Error updating subtask:', error);
        }
    };

    const deleteSubTask = async (taskId, subTaskId) => {
        if (!window.confirm('Are you sure you want to delete this subtask?')) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5555/tasks/${taskId}/subtasks/${subTaskId}`);
            setTasks(tasks.map((t) => t._id === taskId ? response.data : t));
        } catch (error) {
            console.error('Error deleting subtask:', error);
            alert('Failed to delete subtask. Please try again.');
        }
    };

    const toggleExpandTask = (taskId) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const calculateProgress = (task) => {
        if (!task.SubTasks || task.SubTasks.length === 0) return 0;
        const completed = task.SubTasks.filter(sub => sub.completed).length;
        return (completed / task.SubTasks.length) * 100;
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-4">
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Task'}
            </button>

            <div className="flex flex-col space-y-4 w-full">
                {tasks.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No tasks yet. Add your first task!
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="flex flex-col bg-white rounded-lg shadow-md p-4 w-full">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleExpandTask(task._id)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            {expandedTasks[task._id] ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                        </button>
                                        <button
                                            onClick={() => toggleTask(task._id)}
                                            className={`h-6 w-6 border rounded-full flex items-center justify-center transition-colors ${
                                                task.Task_Completed 
                                                    ? "bg-green-500 border-green-500" 
                                                    : "border-gray-300 hover:border-green-500"
                                            }`}
                                        >
                                            {task.Task_Completed && <MdOutlineDone className="text-white" size={14} />}
                                        </button>
                                        <span className={`text-lg font-semibold ${task.Task_Completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                            {task.Task_Title}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600 mt-1 ml-7">
                                        {task.Description}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1 ml-7">
                                        Priority: {task.Priority} | Urgency: {task.Urgency} | Due: {new Date(task.Due_Date).toLocaleDateString()}
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    {task.SubTasks && task.SubTasks.length > 0 && (
                                        <div className="mt-2 ml-7">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Progress</span>
                                                <span>{Math.round(calculateProgress(task))}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${calculateProgress(task)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-x-2 ml-4">
                                    <button
                                        className="p-2 text-blue-500 hover:text-blue-700 rounded-lg transition-colors"
                                        onClick={() => startEditing(task)}
                                    >
                                        <MdModeEditOutline />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="p-2 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {/* Subtasks Section */}
                            {expandedTasks[task._id] && (
                                <div className="mt-4 ml-7 border-t pt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium text-gray-700">Subtasks</h4>
                                        <button
                                            onClick={() => setAddingSubTaskId(task._id)}
                                            className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                                        >
                                            <MdAdd size={16} />
                                            Add Subtask
                                        </button>
                                    </div>

                                    {/* Add Subtask Form */}
                                    {addingSubTaskId === task._id && (
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSubTaskTitle}
                                                onChange={(e) => setNewSubTaskTitle(e.target.value)}
                                                placeholder="Enter subtask title"
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => addSubTask(task._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAddingSubTaskId(null);
                                                    setNewSubTaskTitle('');
                                                }}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md text-sm transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    {/* Subtasks List */}
                                    <div className="space-y-2">
                                        {task.SubTasks && task.SubTasks.length > 0 ? (
                                            task.SubTasks.map((subTask) => (
                                                <div key={subTask._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <button
                                                            onClick={() => toggleSubTask(task._id, subTask._id, subTask.completed)}
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                                subTask.completed 
                                                                    ? 'bg-green-500 border-green-500 text-white' 
                                                                    : 'border-gray-300 hover:border-green-500'
                                                            }`}
                                                        >
                                                            {subTask.completed && <MdOutlineDone size={14} />}
                                                        </button>
                                                        <span className={`flex-1 ${subTask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                            {subTask.title}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteSubTask(task._id, subTask._id)}
                                                        className="text-red-400 hover:text-red-600 transition-colors ml-2"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-400 py-4">
                                                No subtasks yet. Add your first subtask!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={loading}
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={addTask} className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Task Title
                                </label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="text"
                                    value={new_task}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Enter task title"
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
                                    value={new_description}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Enter task description"
                                    rows="3"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={due_date}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                </select>

                                <select
                                    value={urgency}
                                    onChange={(e) => setUrgency(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Low">Low Urgency</option>
                                    <option value="Medium">Medium Urgency</option>
                                    <option value="High">High Urgency</option>
                                </select>
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
                                    {loading ? 'Adding...' : 'Add Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Task Model */}
            {editing_task && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
                            <button 
                                onClick={() => setEditingTask(null)} 
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            saveEdit(editing_task);
                        }} className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Task Title
                                </label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    type="text"
                                    value={edited_text}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={edited_description}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    placeholder="Enter task description"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingTask(null)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Update Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;