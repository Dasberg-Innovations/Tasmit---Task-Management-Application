import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>Habit Hero</h1>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Login</Link>
        <Link to="/hero" style={styles.link}>Hero</Link>
        <Link to="/settings" style={styles.link}>Settings</Link>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#1e1e2f",
    color: "white",
  },
  logo: {
    margin: 0,
    fontSize: "24px",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  }
};

export default Header;
