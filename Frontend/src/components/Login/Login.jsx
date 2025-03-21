import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; 
import "./Login.css";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase.js";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      toast.loading("Logging in...");
      const { data } = await axios.post("/api/auth/login", { email, password });

      toast.dismiss();
      toast.success("Login successful!");

      login(data.user); // Save user in context and localStorage

      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Login failed");
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

      if (data.success) {
        toast.success("Login Successful!");
        login(data.user); // Save user in context and localStorage
        navigate("/");
      } else {
        toast.error("Login Failed! Try again with a different method");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGithubClick = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/github`;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Login to continue</p>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to={`/signup`}>Sign Up</Link>
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

export default Login;
