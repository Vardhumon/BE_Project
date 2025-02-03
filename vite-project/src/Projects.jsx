import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8">GitHub Projects</h1>
      {projects.length === 0 ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-md rounded-lg p-6 w-72 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <Link to={`/project/${project._id}`} className="block">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <div className="text-gray-600">
                  <p className="mb-1">⭐ Stars: {project.stars}</p>
                  <p className="mb-1">📌 Tags: {project.tags.join(", ")}</p>
                  <p className="mb-1">📊 Code Quality: {project.codeQuality}%</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
