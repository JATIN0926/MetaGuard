import React from 'react';
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Login to continue</p>
        <form>
          <div className="input-group">
          <label>Email</label>
            <input type="email" required />
            
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required />
           
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        
        <p className="signup-link">
          Don't have an account? <a href="#">Sign Up</a>
        </p>

        <div className="social-icons">
          <img src="/icons/google-symbol.png" alt="Google" className="social-icon" />
          <img src="/icons/github.png" alt="GitHub" className="social-icon" />
        </div>
      </div>
    </div>
  );
};

export default Login;
