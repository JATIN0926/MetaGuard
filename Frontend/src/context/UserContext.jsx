import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Create Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false); // Track logout state

  // Fetch user details from API when app loads (only if not logged out)
  useEffect(() => {
    if (loggedOut) return; // 🛑 Stop fetching if logged out

    const fetchUser = async () => {
      try {
        console.log("Fetching user...");
        const { data } = await axios.get("/api/users/me", {
          withCredentials: true,
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [loggedOut]); // ✅ Runs only when `loggedOut` changes

  const login = (userData) => {
    setUser(userData);
    setLoggedOut(false); // Reset logout state on login
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/signout", {
        withCredentials: true,
      });
      toast.success("Logged out successfully");

      setUser(null);
      setLoggedOut(true); // Prevent further API calls
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
