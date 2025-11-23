import React from "react";

export default function GoalProgress() {
  const goals = [
    { name: "Exercise", progress: 70 },
    { name: "Study", progress: 40 },
  ];

  return (
    <div>
      <h3>Goals</h3>
      {goals.map((goal, i) => (
        <div key={i} className="goal">
          <span>{goal.name}</span>
          <div className="progress-bar">
            <div style={{ width: `${goal.progress}%` }} className="fill"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
