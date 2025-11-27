import React, { useState, useEffect } from 'react';
import { MdOutlineDone, MdModeEditOutline } from 'react-icons/md';
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
    const { user } = useAuth();
    const [due_date, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [urgency, setUrgency] = useState('Medium');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        try {
            let due_date_to_send = due_date ? new Date(due_date + 'T00:00:00').toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

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
        try {
            await axios.delete(`http://localhost:5555/tasks/${id}`);
            setTasks(tasks.filter((t) => t._id !== id));
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
                Task_Title: edited_text,
                Priority,
                Urgency
            });

            setTasks(tasks.map((t) => t._id === id ? response.data : t));
            setEditingTask(null);
            setEditedText('');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const resetForm = () => {
        setNewTask('');
        setNewDescription('');
        setDueDate('');
        setPriority('Medium');
        setUrgency('Medium');
    };

    const grouped_tasks = tasks.reduce((groups, task) => {
        const date = new Date(task.Due_Date).toLocaleDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(task);
        return groups;
    }, {});

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-4">
            <button 
                onClick={toggleModal} 
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Add Task
            </button>

            <div className="flex flex-col space-y-4 w-full">
                {tasks.map(task => (
                    <div key={task._id} className="flex flex-col bg-white rounded-lg shadow-md p-4 w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-4">
                                <button
                                    onClick={() => toggleTask(task._id)}
                                    className={`h-6 w-6 border rounded-full flex items-center justify-center ${task.Task_Completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-400"}`}
                                >
                                    {task.Task_Completed && <MdOutlineDone className="text-white" />}
                                </button>
                                <div className="flex flex-col">
                                    <span className={`text-gray-800 truncate ${task.Task_Completed ? 'line-through' : ''}`}>
                                        {task.Task_Title} (Priority: {task.Priority}, Urgency: {task.Urgency})
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {task.Description}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-x-2">
                                <button
                                    className="p-2 text-blue-500 hover:text-blue-700 rounded-lg"
                                    onClick={() => startEditing(task)}
                                >
                                    <MdModeEditOutline />
                                </button>
                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="p-2 text-red-500 hover:text-red-700 rounded-lg"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-96">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Task</h1>
                        <button onClick={toggleModal} className="absolute top-2 right-2 text-gray-600">
                            <IoClose size={24} />
                        </button>
                        <form onSubmit={addTask} className="flex flex-col space-y-4">
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
                                type="text"
                                value={new_task}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Task Title"
                                required
                            />
                            <textarea
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
                                value={new_description}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Task Description"
                                required
                            />
                            <input
                                type="date"
                                value={due_date}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
                                required
                            />
                            <div className="flex space-x-2">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                >
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                </select>

                                <select
                                    value={urgency}
                                    onChange={(e) => setUrgency(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                >
                                    <option value="Low">Low Urgency</option>
                                    <option value="Medium">Medium Urgency</option>
                                    <option value="High">High Urgency</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Add Task
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;