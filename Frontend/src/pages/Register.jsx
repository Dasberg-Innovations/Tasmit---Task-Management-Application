import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="page-container">
      <h2>Register</h2>

      <form className="form">
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;
