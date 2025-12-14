import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import HeroCharacter from "../components/HeroCharacter";

export default function HeroPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [goalsRes, tasksRes] = await Promise.all([
        axios.get(`http://localhost:5555/goals/user/${user.id}`),
        axios.get(`http://localhost:5555/tasks/user/${user.id}`)
      ]);
      setGoals(goalsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskProgress = (task) => {
    if (!task.SubTasks?.length) return task.Task_Completed ? 100 : 0;
    return (task.SubTasks.filter(sub => sub.completed).length / task.SubTasks.length) * 100;
  };

  const getOverallTaskProgress = () => {
    if (!tasks.length) return 0;
    return tasks.reduce((sum, task) => sum + getTaskProgress(task), 0) / tasks.length;
  };

  const getTaskStatus = (task) => {
    if (task.Task_Completed) return "Completed";
    const progress = getTaskProgress(task);
    if (progress === 0) return "Not Started";
    if (progress === 100) return "Ready to Complete";
    if (progress > 0 && progress < 100) return "In Progress";
    return "Not Started";
  };

  const getCompletedSubtasksCount = () => {
    return tasks.reduce((total, task) => 
      total + (task.SubTasks?.filter(sub => sub.completed).length || 0), 0);
  };

  const getTotalSubtasksCount = () => {
    return tasks.reduce((total, task) => total + (task.SubTasks?.length || 0), 0);
  };

  const stats = [
    { value: goals.length, label: "Total Goals", color: "text-green-400" },
    { value: tasks.length, label: "Total Tasks", color: "text-blue-400" },
    { 
      value: `${getCompletedSubtasksCount()}/${getTotalSubtasksCount()}`, 
      label: "Subtasks Done", 
      color: "text-yellow-400" 
    },
    { 
      value: `${Math.round(getOverallTaskProgress())}%`, 
      label: "Task Progress", 
      color: "text-purple-400" 
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2e2e4f] text-white font-sans p-10 gap-10 md:flex-row md:p-5 items-center justify-center">
        <div className="text-xl">Loading the Dashboard, Please Wait.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#7c93b5] to-[#a6c1ee] text-white font-sans p-10 gap-10 md:flex-row md:p-5">
      {/* Left side - Character & Stats */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="border-4 border-white rounded-2xl p-4 bg-black bg-opacity-30 backdrop-blur-md">
          <HeroCharacter className="object-cover" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Goals + Tasks */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Goals Section */}
        <div className="goals-section bg-black bg-opacity-20 backdrop-blur-md p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Your Goals Progress</h2>
          {!goals.length ? (
            <div className="text-center text-gray-400 py-4">
              Want to see your progress? Head to the Goals Tab and Create a Goal.
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const completedSubgoals = goal.subGoals?.filter(sub => sub.completed).length || 0;
                const totalSubgoals = goal.subGoals?.length || 0;
                const progress = totalSubgoals ? (completedSubgoals / totalSubgoals) * 100 : 0;
                
                return (
                  <div key={goal._id} className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{goal.Goal_Aim}</h3>
                      <span className="text-sm text-black px-2 py-1 rounded">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-3 truncate">{goal.Description}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-800 mt-1">
                      <span>{completedSubgoals}/{totalSubgoals} Sub Goals</span>
                      <span>{goal.Goal_Completed ? "Completed" : "In Progress"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Tasks Section */}
        <div className="tasks-section bg-black bg-opacity-20 backdrop-blur-md p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Task Progress with Subtasks</h2>
            <span className="text-sm text-gray-300 bg-black bg-opacity-30 px-3 py-1 rounded-full">
              {Math.round(getOverallTaskProgress())}% Overall
            </span>
          </div>
          
          {!tasks.length ? (
            <div className="text-center text-gray-400 py-4">
              There are no tasks yet. Create some tasks to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 4).map((task) => {
                const progress = getTaskProgress(task);
                const completedSubtasks = task.SubTasks?.filter(sub => sub.completed).length || 0;
                const totalSubtasks = task.SubTasks?.length || 0;
                const isOverdue = new Date(task.Due_Date) < new Date() && !task.Task_Completed;
                
                return (
                  <div key={task._id} className="bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          task.Task_Completed ? 'bg-green-400' : 
                          isOverdue ? 'bg-red-400' : 'bg-yellow-400'
                        }`}></div>
                        <div>
                          <div className={`font-medium ${task.Task_Completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.Task_Title}
                          </div>
                          <div className="text-xs text-gray-800">
                            Due: {new Date(task.Due_Date).toLocaleDateString()} | 
                            Status: {getTaskStatus(task)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          task.Priority === 'High' ? 'bg-red-500' :
                          task.Priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        } bg-opacity-30`}>
                          {task.Priority}
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtask Progress */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-800 mb-1">
                        <span>{task.SubTasks ? `${completedSubtasks}/${totalSubtasks} Subtasks` : 'No subtasks'}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progress === 100 ? 'bg-green-500' :
                            progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Subtask Details */}
                    {task.SubTasks?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {task.SubTasks.slice(0, 2).map((subtask) => (
                          <div key={subtask._id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${subtask.completed ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                              <span className={`${subtask.completed ? ' text-gray-700' : 'text-gray-300'}`}>
                                {subtask.title}
                              </span>
                            </div>
                            <span className={`text-xs ${subtask.completed ? 'text-green-500' : 'text-gray-400'}`}>
                              {subtask.completed ? 'Done' : 'Pending'}
                            </span>
                          </div>
                        ))}
                        {task.SubTasks.length > 2 && (
                          <div className="text-xs text-gray-700 text-center">
                            +{task.SubTasks.length - 2} more subtasks
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}