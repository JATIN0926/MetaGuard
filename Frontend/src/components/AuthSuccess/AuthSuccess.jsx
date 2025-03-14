import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    console.log("Token received in frontend:", token);

    if (token) {
      // Store token securely
      localStorage.setItem("access_token", token);

      toast.success("Login Successful!");
      navigate("/");
    } else {
      toast.error("Authentication failed!");
      navigate("/login");
    }
  }, []);

  return <p>Authenticating...</p>;
};

export default AuthSuccess;
