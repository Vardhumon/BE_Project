import { useEffect, useState } from "react";
import axios from "axios";

export default function PostProjectModal({ category, onClose }) {
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    axios
      .get(`http://localhost:5000/api/user-projects/${userId}`)
      .then((res) => setUserProjects(res.data.projects))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = () => {
    if (!selectedProject || !summary.trim() || !link.trim()) return;

    axios
      .post("http://localhost:5000/api/community-post", {
        ...selectedProject,
        summary,
        link,
        category,
      })
      .then(() => {
        onClose();
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold text-white">Post a Project in {category}</h2>

        {/* Select Project */}
        <select
          className="w-full mt-4 p-3 bg-black text-white border border-gray-600 rounded-lg"
          onChange={(e) =>
            setSelectedProject(userProjects.find((p) => p._id === e.target.value))
          }
        >
          <option value="">Select a Project</option>
          {userProjects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>

        {/* Auto-filled Project Data */}
        {selectedProject && (
          <div className="mt-4 text-gray-300">
            <p>📌 Title: {selectedProject.title}</p>
            <p>🛠 Tech Stack: {selectedProject.techStack.join(", ")}</p>
            <p>⚡ Level: {selectedProject.level}</p>
          </div>
        )}

        {/* Summary Input */}
        <textarea
          className="w-full mt-4 p-3 bg-black text-white border border-gray-600 rounded-lg"
          placeholder="Write a summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {/* Link Input */}
        <input
          className="w-full mt-4 p-3 bg-black text-white border border-gray-600 rounded-lg"
          placeholder="Project Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* Post Button */}
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" onClick={handleSubmit}>
          Post
        </button>

        {/* Close Button */}
        <button className="mt-2 text-gray-400 underline w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
