import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Profile from "./Profile";
import HomePage from "./Home";
import View from "./View";
import Navbar from "./NavBar";
import Signup from "./Signup";
import Login from "./Login";
import Choices from "./Choices";
import ProjectDetails from "./ProjectDetails";
import ProjectRecommendation from "./ProjectRecommendation";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  // 🔹 Function to handle login
  const onLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Function to handle signup (similar to login)
  const onSignup = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Function to handle logout
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar user={user} onLogout={onLogout} className="mb-16" />
        <Routes className="mt-16">
          <Route 
            path="/" 
            element={user ? <HomePage /> : <Navigate to="/signup" />} 
          />
          <Route 
            path="/login" 
            element={<Login onLogin={onLogin} />} 
          />
          <Route 
            path="/create-project" 
            element={ <View />} 
          />
          <Route 
            path="/profile" 
            element={<Profile />} 
          />
          <Route 
            path="/signup" 
            element={<Signup onSignup={onSignup} />} 
          />
          <Route 
            path="/choices" 
            element={<Choices />} 
          />
          <Route 
            path="/project-details" 
            element={<ProjectRecommendation />} 
          />
        </Routes>
      </div>
    </Router>
  );
}
