import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const Calendar = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    user && loadTasks();
  }, [user]);

  const loadTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5555/tasks/user/${user.id}`);
      const tasksWithDates = response.data.map(task => ({
        ...task,
        due_date: task.Due_Date ? 
          new Date(new Date(task.Due_Date).setHours(0,0,0,0)) : 
          new Date(new Date(task.createdAt).setHours(0,0,0,0))
      }));
      setTasks(tasksWithDates);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const getTasksForDay = (date) => {
    const dayStart = new Date(date.setHours(0,0,0,0));
    return tasks.filter(task => {
      if (!task.due_date) return false;
      return new Date(task.due_date.setHours(0,0,0,0)).getTime() === dayStart.getTime();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const buildCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const calendar = [];

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      const date = new Date(year, month, i - firstDay + 1);
      calendar.push({ date, isCurrentMonth: false, tasks: [] });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendar.push({ 
        date, 
        isCurrentMonth: true, 
        tasks: getTasksForDay(new Date(date))
      });
    }

    return calendar;
  };

  return (
    <div className="p-4 min-h-screen bg-[#94b4cc]">
      <div className="mt-5 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-light text-gray-900">Calendar</h1>
            <div className="flex items-center gap-1">
              <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-normal text-gray-700">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded">
          <div className="grid grid-cols-7 bg-sky-600 ">
            {dayNames.map(day => (
              <div key={day} className="text-center py-2 text-sm text-white font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {buildCalendar().map((day, index) => {
              const isSelected = selectedDay && day.date.toDateString() === selectedDay.toDateString();
              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border-r border-b border-gray-200 ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isToday(day.date) ? 'bg-blue-50' : ''} ${isSelected ? 'ring-1 ring-blue-600' : ''} hover:bg-gray-50 cursor-pointer`}
                  onClick={() => setSelectedDay(day.date)}
                >
                  <div className={`text-sm mb-1 ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday(day.date) ? 'text-blue-600 font-medium' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {day.tasks.slice(0, 2).map((task, taskIndex) => (
                      <div key={taskIndex} className={`text-xs p-1 rounded truncate ${task.Task_Completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {task.Task_Title}
                      </div>
                    ))}
                    {day.tasks.length > 2 && <div className="text-xs text-gray-500">+{day.tasks.length - 2} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="mt-6 border bg-white border-gray-200 rounded p-4">
            <h3 className="text-lg font-normal text-gray-900 mb-3">
              {selectedDay.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-2 bg-blue-400">
              {getTasksForDay(new Date(selectedDay)).length === 0 ? (
                <p className="text-gray-500 text-center py-2">No tasks</p>
              ) : (
                getTasksForDay(new Date(selectedDay)).map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <h4 className={`${task.Task_Completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.Task_Title}
                      </h4>
                      <p className="text-sm text-gray-600">{task.Description}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded ${task.Task_Completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {task.Task_Completed ? 'Done' : 'Todo'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;