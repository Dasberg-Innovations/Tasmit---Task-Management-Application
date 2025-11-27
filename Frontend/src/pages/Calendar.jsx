import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const Calendar = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allTasks, setAllTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5555/tasks/user/${user.id}`);
      const tasksWithDates = response.data.map(task => {
        let dueDate;
        if (task.Due_Date) {
          const dateObj = new Date(task.Due_Date);
          dueDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        } else {
          const created = new Date(task.createdAt);
          dueDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
        }
        return {
          ...task,
          due_date: dueDate
        };
      });
      setAllTasks(tasksWithDates);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const findTasksForDay = (dayDate) => {
    const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
    return allTasks.filter(task => {
      if (!task.due_date) return false;
      const taskDay = new Date(task.due_date.getFullYear(), task.due_date.getMonth(), task.due_date.getDate());
      return taskDay.getTime() === dayStart.getTime();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const buildCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const calendar = [];

    for (let i = 0; i < firstDay; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - firstDay + 1);
      calendar.push({
        date,
        isCurrentMonth: false,
        tasks: []
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayTasks = findTasksForDay(date);
      calendar.push({
        date,
        isCurrentMonth: true,
        tasks: dayTasks
      });
    }

    return calendar;
  };

  const calendarDays = buildCalendar();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-light text-gray-900">Calendar</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-normal text-gray-700">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded">
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {dayNames.map(day => (
              <div key={day} className="text-center py-2 text-sm text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-24 p-2 border-r border-b border-gray-200
                  ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isToday(day.date) ? 'bg-blue-50' : ''}
                  ${selectedDay && day.date.getTime() === selectedDay.getTime() ? 'ring-1 ring-blue-500' : ''}
                  hover:bg-gray-50 cursor-pointer
                `}
                onClick={() => setSelectedDay(day.date)}
              >
                <div className={`
                  text-sm mb-1
                  ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday(day.date) ? 'text-blue-600 font-medium' : ''}
                `}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {day.tasks.slice(0, 2).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`
                        text-xs p-1 rounded truncate
                        ${task.Task_Completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                        }
                      `}
                    >
                      {task.Task_Title}
                    </div>
                  ))}
                  {day.tasks.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{day.tasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedDay && (
          <div className="mt-6 border border-gray-200 rounded p-4">
            <h3 className="text-lg font-normal text-gray-900 mb-3">
              {selectedDay.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-2">
              {findTasksForDay(selectedDay).length === 0 ? (
                <p className="text-gray-500 text-center py-2">No tasks</p>
              ) : (
                findTasksForDay(selectedDay).map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded"
                  >
                    <div>
                      <h4 className={`${task.Task_Completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.Task_Title}
                      </h4>
                      <p className="text-sm text-gray-600">{task.Description}</p>
                    </div>
                    <div className={`
                      px-2 py-1 text-xs rounded
                      ${task.Task_Completed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                      }
                    `}>
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