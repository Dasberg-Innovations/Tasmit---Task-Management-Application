import React, { useState } from 'react';
import { MdOutlineDone, MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const TaskManager = () => {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editedText, setEditedText] = useState('');

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask) return;
        const task = { _id: Date.now(), text: newTask, completed: false };
        setTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task._id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task._id !== id));
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        setEditedText(task.text);
    };

    const saveEdit = (id) => {
        setTasks(tasks.map((task) => (task._id === id ? { ...task, text: editedText } : task)));
        setEditingTask(null);
        setEditedText('');
    };

    return (
        <div className="min-h-screen from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Task Manager</h1>

                <form onSubmit={addTask} className="flex items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-lg">
                    <input
                        className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done?"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
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
                                        <div className="flex items-center gap-3">
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-x-4">
                                                <button
                                                    onClick={() => toggleTask(task._id)}
                                                    className={` h-6 w-6 border rounded-full flex items-center justify-center ${
                                                        task.completed
                                                            ? "bg-green-500 border-green-500"
                                                            : "border-gray-300 hover:border-blue-400"
                                                    }`}
                                                >
                                                    {task.completed && <MdOutlineDone />}
                                                </button>
                                                <span className={`text-gray-800 truncate ${task.completed ? 'line-through' : ''}`}>
                                                    {task.text}
                                                </span>
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