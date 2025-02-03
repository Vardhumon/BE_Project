import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const UserProfile = ({ user }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:5000/api/user/${user._id}`)
        .then((response) => setProjects(response.data.projects))
        .catch((err) => console.error("Failed to fetch projects:", err));
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <h3 className="text-xl font-semibold mb-4">Completed Projects</h3>
      <ul>
        {projects.map((project, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-4"
          >
            <h4 className="text-lg font-medium">{project.title}</h4>
            <p className="text-sm text-gray-600">Tags: {project.tags.join(", ")}</p>
            <p className="text-sm text-gray-600">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Score: {project.score}</p>
            <p className="text-sm text-gray-600">
              GitHub Repo:{" "}
              <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {project.githubRepo}
              </a>
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default UserProfile;