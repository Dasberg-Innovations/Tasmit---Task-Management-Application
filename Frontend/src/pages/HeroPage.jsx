import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

import HeroCharacter from "../components/HeroCharacter";
import GoalProgress from "../components/GoalProgress";
import TaskList from "../components/TaskList";

export default function HeroPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [goalsResponse, tasksResponse] = await Promise.all([
        axios.get(`http://localhost:5555/goals/user/${user.id}`),
        axios.get(`http://localhost:5555/tasks/user/${user.id}`)
      ]);
      
      setGoals(goalsResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    
    const totalProgress = goals.reduce((sum, goal) => {
      if (!goal.subGoals || goal.subGoals.length === 0) return sum;
      const completed = goal.subGoals.filter(sub => sub.completed).length;
      return sum + (completed / goal.subGoals.length);
    }, 0);
    
    return (totalProgress / goals.length) * 100;
  };

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.Task_Completed).length;
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return tasks
      .filter(task => !task.Task_Completed && new Date(task.Due_Date) <= nextWeek)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2e2e4f] text-gray font-sans p-10 gap-10 md:flex-row md:p-5 items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2e2e4f] text-white font-sans p-10 gap-10 md:flex-row md:p-5">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="border-4 border-white rounded-2xl p-4 bg-black bg-opacity-30 backdrop-blur-md">
          <HeroCharacter className="object-cover" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{goals.length}</div>
            <div className="text-sm text-gray-700">Total Goals</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{tasks.length}</div>
            <div className="text-sm text-gray-700">Total Tasks</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {getCompletedTasksCount()}
            </div>
            <div className="text-sm text-gray-700">Completed Tasks</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(calculateOverallProgress())}%
            </div>
            <div className="text-sm text-gray-700">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Right side - Goals + Tasks */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Goals Section - Customization */}
        <div className="goals-section bg-black bg-opacity-20 backdrop-blur-md p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Your Goals Progress</h2>
          {goals.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              No goals yet. Create some goals to see your progress!
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = goal.subGoals && goal.subGoals.length > 0 
                  ? (goal.subGoals.filter(sub => sub.completed).length / goal.subGoals.length) * 100
                  : 0;
                
                return (
                  <div key={goal._id} className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800 truncate">{goal.Goal_Aim}</h3>
                      <span className="text-sm text-gray-300 bg-black bg-opacity-30 px-2 py-1 rounded">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 truncate">{goal.Description}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-700 mt-1">
                      <span>
                        {goal.subGoals ? goal.subGoals.filter(sub => sub.completed).length : 0}/
                        {goal.subGoals ? goal.subGoals.length : 0} Sub Goals Done
                      </span>
                      <span>{goal.Goal_Completed ? "Completed" : "In Progress"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      {/* Recent Tasks Section - Customization */}
        <div className="tasks-section bg-black bg-opacity-20 backdrop-blur-md p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-">Recent Tasks</h2>
            <span className="text-sm text-gray-300 bg-black bg-opacity-30 px-3 py-1 rounded-full">
              {getCompletedTasksCount()}/{tasks.length} completed
            </span>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              There are no tasks yet. Create some tasks to get the streak going.
            </div>
          ) : (
            <div className="space-y-3">
              {getUpcomingTasks().map((task) => (
                <div key={task._id} className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.Task_Completed ? 'bg-green-400' : 
                      new Date(task.Due_Date) < new Date() ? 'bg-red-400' : 'bg-yellow-400'
                    }`}></div>
                    <div>
                      <div className={`font-medium ${task.Task_Completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.Task_Title}
                      </div>
                      <div className="text-xs text-gray-400">
                        Due: {new Date(task.Due_Date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    task.Priority === 'High' ? 'bg-red-500' :
                    task.Priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  } bg-opacity-30`}>
                    {task.Priority}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {tasks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Task Completion</span>
                <span>{Math.round((getCompletedTasksCount() / tasks.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(getCompletedTasksCount() / tasks.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}