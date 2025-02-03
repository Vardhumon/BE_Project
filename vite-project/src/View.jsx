import { useState, useEffect } from "react";
import axios from "axios";

export default function View() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = () => {
    setLoading(true);
    axios
      .post("http://localhost:5000/api/getProject", {
        userStack: ["Github"], // Example user stack
        userId: "12345",
        experienceLevel: "Intermediate",
      })
      .then((res) => {
        setProject(res.data.project);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProject();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading project...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 border border-gray-200 relative">
      {/* New Project Button in Top Right */}
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={fetchProject}
      >
        New Project
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mt-4">{project.title}</h1>
      <p className="text-gray-600 mt-2">{project.description}</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700">Tech Stack:</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStack.map((tech, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Project Steps & Sub-Steps */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700">Project Steps:</h2>
        <div className="space-y-4 mt-2">
          {project.steps.map((step, index) => (
            <div key={index} className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-800">{step.step}</h3>

              {/* Sub-Steps */}
              <ul className="list-disc list-inside text-gray-600 mt-2 pl-4">
                {step.subSteps.map((subStep, i) => (
                  <li key={i} className="text-gray-700">{subStep}</li>
                ))}
              </ul>

              {/* Resources */}
              <h4 className="font-medium text-blue-700 mt-3">Resources:</h4>
              <ul className="list-disc list-inside text-blue-500">
                {step.resources.map((resource, i) => (
                  <li key={i}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between text-gray-600">
        <span className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full">{project.tag}</span>
        <span className="font-medium">Deadline: {project.deadline}</span>
      </div>
    </div>
  );
}
