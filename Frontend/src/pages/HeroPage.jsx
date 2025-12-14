import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";


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
        axios.get(`https://tasmit-task-management-application.onrender.com/goals/user/${user.id}`),
        axios.get(`https://tasmit-task-management-application.onrender.com/tasks/user/${user.id}`)
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
    { value: goals.length, label: "Total Goals", color: "text-[#2A2E45]" },
    { value: tasks.length, label: "Total Tasks", color: "text-[#2A2E45]" },
    {
      value: `${getCompletedSubtasksCount()}/${getTotalSubtasksCount()}`,
      label: "Subtasks Done",
      color: "text-[#2A2E45]"
    },
    {
      value: `${Math.round(getOverallTaskProgress())}%`,
      label: "Task Progress",
      color: "text-[#2A2E45]"
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 font-sans p-10 gap-10 md:flex-row md:p-5 items-center justify-center">
        <div className="text-xl">Loading the Dashboard, Please Wait.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col  bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 font-sans p-10 gap-10 md:p-5">
      <div className="mt-7 w-full max-w-6xl mx-auto">
        <div className="bg-[#92B9BD] backdrop-blur-md rounded-3xl p-6 border-slate-200">
          <div className="bg grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-slate-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
        {/* Goals Section */}
        <div className="flex-1 goals-section bg-[#776472] backdrop-blur-md p-6 rounded-3xl border-amber-100">
          <h2 className="text-2xl font-bold mb-4 text-white">Your Goals Progress</h2>
          {!goals.length ? (
            <div className="text-center text-slate-500 py-4">
              Want to see your progress? Head to the Goals Tab and Create a Goal.
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const completedSubgoals = goal.subGoals?.filter(sub => sub.completed).length || 0;
                const totalSubgoals = goal.subGoals?.length || 0;
                const progress = totalSubgoals ? (completedSubgoals / totalSubgoals) * 100 : 0;

                return (
                  <div key={goal._id} className="bg-white/90 rounded-lg p-4  border-amber-100 hover:border-amber-200 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-slate-800 truncate">{goal.Goal_Aim}</h3>
                      <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 truncate">{goal.Description}</p>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>{completedSubgoals}/{totalSubgoals} Sub Goals</span>
                      <span className={goal.Goal_Completed ? "text-emerald-600 font-medium" : "text-amber-600"}>{goal.Goal_Completed ? "Completed" : "In Progress"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="flex-1 tasks-section bg-[#A799B7] backdrop-blur-md p-6 rounded-3xl border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Task Progress with Subtasks</h2>
            <span className="text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
              {Math.round(getOverallTaskProgress())}% Overall
            </span>
          </div>

          {!tasks.length ? (
            <div className="text-center text-slate-500 py-4">
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
                  <div key={task._id} className="bg-white/90 rounded-lg p-3 border-slate-200 hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${task.Task_Completed ? 'bg-emerald-500' :
                          isOverdue ? 'bg-rose-500' : 'bg-amber-500'
                          }`}></div>
                        <div>
                          <div className={`font-medium ${task.Task_Completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.Task_Title}
                          </div>
                          <div className="text-xs text-slate-600">
                            Due: {new Date(task.Due_Date).toLocaleDateString()} |
                            Status: {getTaskStatus(task)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-xs px-2 py-1 rounded-full ${task.Priority === 'High' ? 'bg-rose-100 text-rose-800' :
                          task.Priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                          {task.Priority}
                        </div>
                      </div>
                    </div>

                    {/* Subtask Progress */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{task.SubTasks ? `${completedSubtasks}/${totalSubtasks} Subtasks` : 'No subtasks'}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' :
                            progress >= 50 ? 'bg-amber-500' : 'bg-rose-500'
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
                              <div className={`w-2 h-2 rounded-full ${subtask.completed ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                              <span className={`${subtask.completed ? 'text-slate-600' : 'text-slate-500'}`}>
                                {subtask.title}
                              </span>
                            </div>
                            <span className={`text-xs ${subtask.completed ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                              {subtask.completed ? 'Done' : 'Pending'}
                            </span>
                          </div>
                        ))}
                        {task.SubTasks.length > 2 && (
                          <div className="text-xs text-slate-500 text-center">
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