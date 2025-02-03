import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    techStack: [],
    experienceLevel: "",
  });

  const techOptions = [
    "React", "Node.js", "MongoDB", "Express", "Python", "Java", "Machine Learning", "Django", "Vue.js", "Angular", "Ruby on Rails", "Flutter", "Go", "C++", "Swift",
  ];

  const handleTechChange = (tech) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const handleExperienceChange = (level) => {
    setFormData((prev) => ({
      ...prev,
      experienceLevel: level,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        ...formData,
        techStack: formData.techStack.join(", "), // Save as comma-separated string
      });
      onSignup(response.data.token, response.data.user);
    } catch (err) {
      console.error("Signup failed:", err.response?.data?.message || "Server error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Tech Stack Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Your Tech Stack:</label>
          <div className="flex flex-wrap gap-2">
            {techOptions.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechChange(tech)}
                className={`p-2 border rounded-lg ${
                  formData.techStack.includes(tech)
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Experience Level:</label>
          <div className="flex gap-4">
            {["Beginner", "Intermediate", "Expert"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleExperienceChange(level)}
                className={`p-2 border rounded-lg ${
                  formData.experienceLevel === level
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Sign Up
        </button>
      </form>
    </motion.div>
  );
};

export default Signup;
