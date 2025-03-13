import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!isChecked) {
      return toast.error("You must agree to the terms & conditions");
    }

    try {
      setLoading(true);
      toast.loading("Signing up...");
      const { data } = await axios.post("/api/user/signup", { username, email, password });

      toast.dismiss();
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <p>Join us today!</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
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
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to={`/login`}>Login</Link>
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
