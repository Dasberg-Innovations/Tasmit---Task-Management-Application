import React from "react";
import "./HeroPage.css";

// Import components
import HeroCharacter from "../components/HeroCharacter";
import GoalProgress from "../components/GoalProgress";
import TaskList from "../components/TaskList";

export default function HeroPage() {
  return (
    <div className="hero-page">
      {/* Left side - Character */}
      <HeroCharacter />

      {/* Right side - Goals + Tasks */}
      <div className="hero-right">
        <GoalProgress />
        <TaskList />
      </div>
    </div>
  );
}
