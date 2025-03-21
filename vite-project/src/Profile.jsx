import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/getUserProjects", {
        userId: "679f4c0b62462cb876bafceb",
      })
      .then((res) => {
        setProjects(res.data.projects);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleCheckboxChange = (projectId, stepId, subStep) => {
    setCompletedSteps((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated[projectId]) updated[projectId] = {};
      if (!updated[projectId][stepId]) updated[projectId][stepId] = [];

      if (updated[projectId][stepId].includes(subStep)) {
        updated[projectId][stepId] = updated[projectId][stepId].filter(
          (item) => item !== subStep
        );
      } else {
        updated[projectId][stepId].push(subStep);
      }

      return updated;
    });
  };

  const handleSubmit = (projectId) => {
    const completed = completedSteps[projectId] || {};
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user)._id : null;

    axios
      .post("http://localhost:5000/api/update-task-progress", {
        userId,
        projectId,
        completedSteps: completed,
      })
      .then(() => {
        alert("Progress saved successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save progress.");
      });
  };

  const handleLogout = () => {
    localStorage.clear(); // Clears all stored data
    navigate("/login"); // Redirect to login page
  };

  if (loading)
    return <p className="text-center text-gray-400">Loading projects...</p>;

  return (
    <motion.div
    className="max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-xl mt-10 text-white relative"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    >

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1 className="text-2xl font-bold">My Projects</motion.h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <p className="text-gray-300 mt-4">No projects assigned yet.</p>
      ) : (
        <div className="space-y-4 mt-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              className="p-5 border border-gray-600 bg-white/10 backdrop-blur-xl rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2
                className="text-lg font-semibold cursor-pointer"
                onClick={() => toggleProject(project._id)}
              >
                {project.title}
              </h2>
              <p className="text-gray-300 mt-1">{project.description}</p>

              {expandedProject === project._id && (
                <div className="mt-4">
                  {project.steps.map((step) => (
                    <div key={step._id} className="mb-3">
                      <h3 className="text-white font-medium">{step.step}</h3>
                      <ul className="ml-4 mt-2 space-y-2">
                        {step.subSteps.map((subStep, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={
                                completedSteps[project._id]?.[step._id]?.includes(
                                  subStep
                                ) || false
                              }
                              onChange={() =>
                                handleCheckboxChange(project._id, step._id, subStep)
                              }
                              className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-gray-300">{subStep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button
                    onClick={() => handleSubmit(project._id)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit Progress
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
