import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the project ID from the URL

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => console.error("Error fetching project details:", err));
  }, [id]);

  if (!project) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">{project.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p>{project.description}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <ul className="space-y-4">
          {project.tasks.map((task, index) => (
            <li key={index}>
              <h3 className="font-semibold">{task.title}</h3>
              <p>{task.summary}</p>
              <p className="text-sm text-gray-500">{task.details}</p>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-blue-500 hover:underline"
      >
        🔗 View Repo
      </a>
    </div>
  );
};

export default ProjectDetails;
