import React, { useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BackgroundAnimation = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 0.5, scale: 1, y: -50 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: i * 0.8 }}
          className="absolute bg-white rounded-full blur-3xl"
          style={{
            width: `${30 + i * 30}px`,
            height: `${30 + i * 30}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </>
  );
};

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      onLogin(response.data.token, response.data.user);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || "Server error");
    }
  };

  const backgroundElements = useMemo(() => <BackgroundAnimation />, []);

  return (
    <div className="h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {backgroundElements}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-black bg-opacity-80 backdrop-blur-lg shadow-lg border border-white/30 rounded-xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white text-center"
        >
          Login
        </motion.h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-white/30 text-white rounded-lg focus:ring-4 focus:ring-white focus:outline-none"
              required
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-white/30 text-white rounded-lg focus:ring-4 focus:ring-white focus:outline-none"
              required
            />
          </motion.div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            animate={{ boxShadow: [
              "0px 0px 10px rgba(255, 255, 255, 0.5)",
              "0px 0px 20px rgba(255, 255, 255, 0.8)",
              "0px 0px 10px rgba(255, 255, 255, 0.5)"
            ] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-full p-3 bg-white text-black font-semibold rounded-lg transition duration-300 shadow-lg"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
