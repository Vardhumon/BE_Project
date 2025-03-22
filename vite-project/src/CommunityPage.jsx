import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";



const CommunityPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [userProjects, setUserProjects] = useState([]);
    const [submittedProjects, setSubmittedProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [summary, setSummary] = useState("");
    const [deployedLink, setDeployedLink] = useState("");
    const [expandedProject, setExpandedProject] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const toggleExpand = (projectId) => {
        setExpandedProject(expandedProject === projectId ? null : projectId);
    };
    

    useEffect(() => {
        fetchSubmittedProjects();
        const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            console.log("Community:", community);
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
    }, []);

    const fetchSubmittedProjects = async () => {
        try {
            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            const response = await axios.get("http://localhost:5000/api/getSubmittedProjects");
            const filteredProjects = response.data.filter(project => project.community === community);
            console.log("Filtered Projects:", filteredProjects);
            setSubmittedProjects(filteredProjects);
        } catch (error) {
            console.error("Error fetching submitted projects:", error);
        }
    };

    const fetchUserProjects = async () => {
        const user = localStorage.getItem("user");
        const userId = user ? JSON.parse(user)._id : null;
        console.log("User ID:", user);
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:5000/api/getUserProjects", { userId });
            console
            const projects = response.data.projects.map(p => ({
                ...p.projectId, 
                repoUrl: p.repoUrl 
            }));
            console.log("User Projects:", projects);
            setUserProjects(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleProjectSelect = (projectId) => {
        const project = userProjects.find((p) => p._id === projectId);
        setSelectedProject(project || null);
    };

    const handlePublish = async () => {
        if (!selectedProject || !summary || !deployedLink) {
            alert("Please fill all fields!");
            return;
        }
    
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user._id) {
                alert("User not found. Please log in again.");
                return;
            }

            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            console.log("Community:", community);
            const newPost = {
                userId: user._id,
                username: user.name,
                projectId: selectedProject._id,
                githubLink: selectedProject.repoUrl || "", 
                deploymentLink: deployedLink,
                summary,
                community
            };

            const response = await axios.post("http://localhost:5000/api/submitProject", newPost);
            
            if (response.status === 201) {
                toast.success("Project submitted successfully!");
                fetchSubmittedProjects(); // Refresh submitted projects
                setShowModal(false);
                setSelectedProject(null);
                setSummary("");
                setDeployedLink("");
            } else {
                alert("Failed to submit project.");
            }
        } catch (error) {
            console.error("Error submitting project:", error);
            alert("Error submitting project. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0D1117] text-white p-8 mt-10">
            <Toaster />
            <div className="flex items-center justify-evenly mb-8">
            <h1 className="text-3xl font-semibold text-center mb-6">Community Posts</h1>

            <div className="flex justify-center mb-6">
                <button 
                    onClick={() => { setShowModal(true); fetchUserProjects(); }}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition"
                >
                    Post a Project
                </button>
            </div>
            </div>
        
            <div className="grid gap-6 max-w-4xl mx-auto">
            {submittedProjects.map((project) => {
                const isExpanded = expandedProject === project._id;

                return (
                    <div 
                        key={project._id} 
                        className="bg-[#161B22] p-6 rounded-lg shadow-lg cursor-pointer"
                        onClick={() => toggleExpand(project._id)}
                    >
                        {/* Title and Summary */}
                        <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{project.projectId.title}</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-400">Created by:</p>
                            <p className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">{project.username}</p>
                        </div>

                        </div>
                        <p className="text-gray-400">{project.summary}</p>

                        {/* Community Tag */}
                        <div className="mt-4">
                            <span className="font-semibold text-gray-300">Community:</span>
                            <span className="bg-[#21262D] text-white px-3 py-1 text-sm rounded-lg ml-2">
                                {project.community}
                            </span>
                        </div>

                        {/* Deployment Link */}
                        {project.deploymentLink && (
                            <div className="mt-4">
                                <a href={project.deploymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    View Deployed Project
                                </a>
                            </div>
                        )}

                        {/* Expanded Section with Framer Motion */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 p-4 bg-[#21262D] rounded-lg overflow-hidden"
                                >
                                    {/* Description */}
                                    <p className="text-gray-300">{project.projectId.description}</p>

                                    {/* Tech Stack */}
                                    <div className="mt-4">
                                        <span className="font-semibold text-gray-300">Tech Stack:</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.projectId.techStack.map((tech, index) => (
                                                <span key={index} className="bg-[#1E293B] text-white px-3 py-1 text-sm rounded-lg">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Steps */}
                                    <div className="mt-4">
                                        <span className="font-semibold text-gray-300">Project Steps:</span>
                                        <ul className="list-disc pl-5 text-gray-400 mt-2">
                                            {project.projectId.steps.map((step) => (
                                                <li key={step._id}>
                                                    <strong>{step.step}</strong>
                                                    <ul className="list-disc pl-5 mt-1">
                                                        {step.subSteps.map((subStep, index) => (
                                                            <li key={index} className="text-gray-500">{subStep}</li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* GitHub Link */}
                                    {project.githubLink && (
                                        <div className="mt-4">
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                View GitHub Repository
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-[#161B22] rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Create a Post</h2>
                        
                        <label className="block text-gray-300 font-medium mb-2">Select a Project:</label>
                        <select 
                            onChange={(e) => handleProjectSelect(e.target.value)}
                            className="w-full bg-[#21262D] border border-gray-600 rounded-md p-2 mb-4 text-white focus:ring focus:ring-blue-400"
                        >
                            <option value="">Select a Project</option>
                            {userProjects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>

                        <label className="block text-gray-300 font-medium mt-4">Summary:</label>
                        <textarea 
                            value={summary} 
                            onChange={(e) => setSummary(e.target.value)}
                            className="w-full bg-[#21262D] border border-gray-600 rounded-md p-2 mt-1 text-white focus:ring focus:ring-blue-400"
                        />

                        <label className="block text-gray-300 font-medium mt-4">Deployed Link:</label>
                        <input 
                            type="text" 
                            value={deployedLink} 
                            onChange={(e) => setDeployedLink(e.target.value)}
                            className="w-full bg-[#21262D] border border-gray-600 rounded-md p-2 mt-1 text-white focus:ring focus:ring-blue-400"
                        />

                        <div className="flex justify-between mt-6">
                            <button 
                                onClick={handlePublish}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                            >
                                Publish
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;
