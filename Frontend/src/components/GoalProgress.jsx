import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GoalProgress({ userId }) {
  const [goals, setGoals] = useState([
    { name: "Exercise", progress: 0 },
    { name: "Study", progress: 0 },
  ]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`/api/tasks/user/${userId}`);
        const fetchedTasks = response.data;
        setTasks(fetchedTasks);
        updateGoalsProgress(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId]);

  const updateGoalsProgress = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.Task_Completed).length;

    const exerciseProgress = (completedTasks / totalTasks) * 100 || 0;
    const studyProgress = (completedTasks / totalTasks) * 100 || 0;

    setGoals([
      { name: "Exercise", progress: exerciseProgress },
      { name: "Study", progress: studyProgress },
    ]);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Goals</h3>
      {goals.map((goal, i) => (
        <div key={i} className="mb-4">
          <span className="font-medium">{goal.name}</span>
          <div className="bg-gray-200 rounded-full h-4">
            <div 
              style={{ width: `${goal.progress}%` }} 
              className="bg-teal-500 h-full rounded-full transition-all duration-300"
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}