import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const Calendar = () => {
  const { user } = useAuth();
  const [current_month, set_current_month] = useState(new Date());
  const [all_tasks, set_all_tasks] = useState([]);
  const [selected_day, set_selected_day] = useState(null);

  useEffect(() => {
    if (user) {
      load_tasks();
    }
  }, [user]);

  const load_tasks = async () => {
    try {
        const response = await axios.get(`http://localhost:5555/tasks/user/${user.id}`);
        
        const tasks_with_dates = response.data.map(task => {
            let due_date;
            if (task.Due_Date) {
                const dateObj = new Date(task.Due_Date);
                due_date = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
            } else {
                const created = new Date(task.createdAt);
                due_date = new Date(created.getFullYear(), created.getMonth(), created.getDate());
            }
            
            return {
                ...task,
                due_date: due_date
            };
        });
        
        set_all_tasks(tasks_with_dates);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
};

  const get_total_days_in_month = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const get_starting_weekday = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const go_to_previous_month = () => {
    set_current_month(new Date(current_month.getFullYear(), current_month.getMonth() - 1, 1));
  };

  const go_to_next_month = () => {
    set_current_month(new Date(current_month.getFullYear(), current_month.getMonth() + 1, 1));
  };

  const find_tasks_for_day = (day_date) => {
    const day_start = new Date(day_date.getFullYear(), day_date.getMonth(), day_date.getDate());
    
    return all_tasks.filter(task => {
      if (!task.due_date) return false;
      
      const task_day = new Date(task.due_date.getFullYear(), task.due_date.getMonth(), task.due_date.getDate());
      
      return task_day.getTime() === day_start.getTime();
    });
  };

  const is_current_day = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const build_calendar_grid = () => {
    const total_days = get_total_days_in_month(current_month);
    const start_day = get_starting_weekday(current_month);
    const calendar_grid = [];

    for (let i = 0; i < start_day; i++) {
      const date = new Date(current_month.getFullYear(), current_month.getMonth(), i - start_day + 1);
      calendar_grid.push({
        date,
        is_this_month: false,
        tasks: []
      });
    }

    for (let day = 1; day <= total_days; day++) {
      const date = new Date(current_month.getFullYear(), current_month.getMonth(), day);
      const day_tasks = find_tasks_for_day(date);
      calendar_grid.push({
        date,
        is_this_month: true,
        tasks: day_tasks
      });
    }

    return calendar_grid;
  };

  const calendar_grid = build_calendar_grid();
  const month_names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const day_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={go_to_previous_month}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-semibold text-gray-700">
                {month_names[current_month.getMonth()]} {current_month.getFullYear()}
              </h2>
              <button
                onClick={go_to_next_month}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {day_labels.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendar_grid.map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-32 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${day.is_this_month 
                    ? is_current_day(day.date) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    : 'border-gray-100 bg-gray-50'
                  }
                  ${selected_day && day.date.getTime() === selected_day.getTime() ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => set_selected_day(day.date)}
              >
                <div className={`
                  text-sm font-semibold mb-2
                  ${day.is_this_month 
                    ? is_current_day(day.date) 
                      ? 'text-blue-600' 
                      : 'text-gray-700'
                    : 'text-gray-400'
                  }
                `}>
                  {day.date.getDate()}
                  {day.tasks.length > 0 && (
                    <span className="ml-1 text-xs text-gray-500">({day.tasks.length})</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {day.tasks.slice(0, 3).map((task, task_index) => (
                    <div
                      key={task_index}
                      className={`
                        text-xs p-1 rounded truncate
                        ${task.Task_Completed 
                          ? 'bg-green-100 text-green-800 line-through' 
                          : 'bg-blue-100 text-blue-800'
                        }
                      `}
                      title={task.Task_Title}
                    >
                      {task.Task_Title}
                    </div>
                  ))}
                  {day.tasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{day.tasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected_day && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Tasks for {selected_day.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-3">
              {find_tasks_for_day(selected_day).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tasks due on this date</p>
              ) : (
                find_tasks_for_day(selected_day).map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.Task_Completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.Task_Title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{task.Description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(task.due_date).toLocaleDateString()} at {new Date(task.due_date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${task.Task_Completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        }
                      `}>
                        {task.Task_Completed ? 'Completed' : 'Pending'}
                      </span>
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