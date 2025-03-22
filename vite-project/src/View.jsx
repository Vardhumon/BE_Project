  import { useState, useEffect } from "react";
  import axios from "axios";
  import { motion } from "framer-motion";
  import toast, { Toaster } from "react-hot-toast";


  export default function View() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accepting, setAccepting] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [repoUrl, setRepoUrl] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const fetchProject = () => {
      setLoading(true);
      setAccepted(false);
      setVerified(false);
      setRepoUrl("");
      const userStack = JSON.parse(localStorage.getItem("techStack")) || ["Github"];
      const userId = localStorage.getItem("user") || "12345";
      const experienceLevel = localStorage.getItem("experience") || "Intermediate";

      axios
        .post("http://localhost:5000/api/getProject", {
          userStack,
          userId,
          experienceLevel,
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

    const acceptProject = () => {
      if (!verified) {
        toast.error("Please verify your GitHub repository first.");
        return;
      }

      setAccepting(true);
      axios
        .post("http://localhost:5000/api/acceptProject", {
          userId: JSON.parse(localStorage.getItem("user"))._id,
          projectId: project._id,
          repoUrl
        })
        .then(() => {
          setAccepted(true);
          toast.success("Project accepted successfully!");
        })
        .catch(() => {
          toast.error("Error accepting project.");
        })
        .finally(() => {
          setAccepting(false);
        });
    };

    const verifyGitHubRepo = () => {
      if (!repoUrl.trim()) {
        toast.error("Enter a valid GitHub repository URL.");
        return;
      }

      setVerifying(true);
      axios
        .post("http://localhost:5000/api/verifyGithubRepo", { repoUrl })
        .then((res) => {
          if (res.data.verified) {
            setVerified(true);
            toast.success("Repository is public and accessible!");
          } else {
            toast.error("Repository is not public or doesn't exist.");
          }
        })
        .catch(() => {
          toast.error("Error verifying repository.");
        })
        .finally(() => {
          setVerifying(false);
        });
    };

    if (loading) return <p className="text-center text-gray-400">Loading project...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
      <motion.div 
        className="max-w-3xl mx-auto p-6 bg-black text-white shadow-lg rounded-xl mt-10 border border-gray-700 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Toaster />
        <button
          className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-300"
          onClick={fetchProject}
        >
          New Project
        </button>

        <motion.h1 
          className="text-2xl font-semibold mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {project.title}
        </motion.h1>

        <motion.p 
          className="text-gray-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {project.description}
        </motion.p>

        <div className="mt-4">
          <h2 className="text-lg font-medium">Tech Stack:</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.techStack.map((tech, index) => (
              <motion.span
                key={index}
                className="bg-gray-800 text-white px-3 py-1 text-sm rounded-full"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium">Project Steps:</h2>
          <div className="space-y-4 mt-2">
            {project.steps.map((step, index) => (
              <motion.div
                key={index}
                className="p-4 border-l-4 border-white bg-gray-900 rounded-md"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="font-semibold">{step.step}</h3>
                <ul className="list-disc list-inside text-gray-400 mt-2 pl-4">
                  {step.subSteps.map((subStep, i) => (
                    <li key={i}>{subStep}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center text-gray-400">
          <span className="bg-gray-800 px-3 py-1 text-sm rounded-full">{project.tag}</span>
          <span className="font-medium">Deadline: {project.deadline}</span>
        </div>

        {/* GitHub Verification Section */}
        <div className="mt-6">
          <h2 className="text-lg font-medium">GitHub Repository Verification</h2>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Enter GitHub Repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded-md"
            />
            <button
              className={`px-4 py-2 rounded-md ${
                verified ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              onClick={verifyGitHubRepo}
              disabled={verifying || verified}
            >
              {verified ? "Verified" : verifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>

        {!accepted ? (
          <motion.button
            className="mt-6 w-full bg-white text-black px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={acceptProject}
            disabled={accepting}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            {accepting ? "Accepting..." : "Accept Project"}
          </motion.button>
        ) : (
          <motion.p 
            className="mt-6 text-green-400 font-semibold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Project Accepted!
          </motion.p>
        )}
      </motion.div>
    );
  }
