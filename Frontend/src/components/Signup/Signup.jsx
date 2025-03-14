import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../../firebase.js";

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
  const auth = getAuth(app);

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
      const { data } = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
      });

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

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const { data } = await axios.post("/api/auth/google", {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        photoURL: resultsFromGoogle.user.photoURL,
      });

      console.log("data", data);

      if (data.success) {
        toast.success("Login Successful!");
        navigate("/");
      } else {
        toast.error("Login Failed ! , Try again with a different method");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGithubClick = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/api/auth/github`;
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <p>Join us today!</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label htmlFor="terms">
              I agree to the <a href="#">terms & conditions</a>
            </label>
          </div>
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to={`/login`}>Login</Link>
        </p>
        <div className="social-icons">
          <img
            src="/icons/google-symbol.png"
            alt="Google"
            className="social-icon google"
            onClick={handleGoogleClick}
          />
          <img
            src="/icons/github.png"
            alt="GitHub"
            className="social-icon"
            onClick={handleGithubClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
