import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="page-container">
      <h2>Login</h2>

      <form className="form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
