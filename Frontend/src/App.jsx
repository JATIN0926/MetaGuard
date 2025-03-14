import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Homepage from "./components/Homepage/Homepage";
import { Toaster } from "react-hot-toast";
import FileUpload from "./components/FileUpload/FileUpload";

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/fileUpload" element={<FileUpload />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
