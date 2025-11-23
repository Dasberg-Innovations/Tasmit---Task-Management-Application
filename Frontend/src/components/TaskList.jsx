import React from "react";

import { useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { text: "Drink water", done: false },
    { text: "Read 10 pages", done: true },
  ]);

  const toggleTask = index => {
    setTasks(tasks.map((t, i) => i === index ? { ...t, done: !t.done } : t));
  };

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task, i) => (
          <li key={i} onClick={() => toggleTask(i)}>
            <input type="checkbox" checked={task.done} readOnly />
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
