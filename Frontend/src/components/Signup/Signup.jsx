import React, { useState } from 'react';
import "./Signup.css";

const Signup = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <p>Join us today!</p>
        <form>
          <div className="input-group">
            <label>Name</label>
            <input type="text" required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" required />
          </div>
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="terms" 
              checked={isChecked} 
              onChange={() => setIsChecked(!isChecked)}
            />
            <label htmlFor="terms">I agree to the <a href="#">terms & conditions</a></label>
          </div>
          <button type="submit" className="signup-btn" disabled={!isChecked}>
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="#">Login</a>
        </p>
        <div className="social-icons">
          <i className='bx bxl-google'></i>
          <i className='bx bxl-github'></i>
        </div>
      </div>
    </div>
  );
};

export default Signup;
