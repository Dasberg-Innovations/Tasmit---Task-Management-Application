import React, { useState, useEffect } from 'react';
import { MdOutlineDone, MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const TaskManager = () => {
    const [newTask, setNewTask] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editedText, setEditedText] = useState('');
    const { user } = useAuth();

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
        if (!newTask || !newDescription || !user) return;
        
        try {
            const response = await axios.post('http://localhost:5555/tasks', {
                userId: user.id,
                Task_Title: newTask,
                Description: newDescription,
                Task_Completed: false
            });
            setTasks([...tasks, response.data]);
            setNewTask('');
            setNewDescription('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const response = await axios.put(`http://localhost:5555/tasks/${id}`, {
                Task_Completed: !task.Task_Completed
            });
            
            setTasks(tasks.map((task) =>
                task._id === id ? response.data : task
            ));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5555/tasks/${id}`);
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        setEditedText(task.Task_Title);
    };

    const saveEdit = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5555/tasks/${id}`, {
                Task_Title: editedText
            });
            
            setTasks(tasks.map((task) => 
                task._id === id ? response.data : task
            ));
            setEditingTask(null);
            setEditedText('');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="min-h-screen from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Task Manager</h1>

                <form onSubmit={addTask} className="space-y-4 mb-6">
                    <input
                        className="w-full outline-none px-3 py-2 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-lg"
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Task Title"
                        required
                    />
                    <textarea
                        className="w-full outline-none px-3 py-2 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-lg"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Task Description"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
                    >
                        Add Task
                    </button>
                </form>
                
                <div className="mt-4">
                    {tasks.length === 0 ? (
                        <div className="text-gray-500 text-center">No tasks added yet.</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {tasks.map((task) => (
                                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-200 rounded-lg shadow-inner">
                                    {editingTask === task._id ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <input
                                                className="flex-1 p-2 border rounded-lg border-gray-300 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
                                                type="text"
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEdit(task._id)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer flex items-center"
                                                >
                                                    <MdOutlineDone />
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                                                    onClick={() => setEditingTask(null)}
                                                >
                                                    <IoClose />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    onClick={() => toggleTask(task._id)}
                                                    className={`h-6 w-6 border rounded-full flex items-center justify-center ${
                                                        task.Task_Completed
                                                            ? "bg-green-500 border-green-500 text-white"
                                                            : "border-gray-300 hover:border-blue-400"
                                                    }`}
                                                >
                                                    {task.Task_Completed && <MdOutlineDone />}
                                                </button>
                                                <div className="flex flex-col">
                                                    <span className={`text-gray-800 truncate ${task.Task_Completed ? 'line-through' : ''}`}>
                                                        {task.Task_Title}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        {task.Description}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-x-2">
                                                <button
                                                    className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                                                    onClick={() => startEditing(task)}
                                                >
                                                    <MdModeEditOutline />
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task._id)}
                                                    className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskManager;