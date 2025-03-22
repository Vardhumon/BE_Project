import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Choices() {
  const navigate = useNavigate();
  const [selectedTech, setSelectedTech] = useState([]);
  const [experience, setExperience] = useState("");

  // 🔹 All Available Tech Stacks
  const allTechStack = [
    "React", "Node.js", "Python", "Django", "Flask",
    "NLTK", "TensorFlow", "Next.js", "Firebase", 
    "Flutter", "ML", "DevOps", "MongoDB"
  ];

  // 🔹 Load Previously Selected Tech Stack (if exists)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || [];
    const techstack = user.techStack ||  [];
    console.log(techstack);
    const experienceLevel = user.experienceLevel || (localStorage.getItem("experience")) || "";
    // Ensure proper separation of multiple tech stacks
    const separatedTech = techstack.flatMap(tech => tech.split(", ").map(t => t.trim()));
    setSelectedTech(separatedTech);
    setExperience(experienceLevel);
  }, []);

  // 🔹 Handle Tech Selection (Select/Deselect)
  const handleTechSelect = (tech) => {
    let updatedStack;

    if (selectedTech.includes(tech)) {
      // 🔹 Deselect: Remove tech from selected list
      updatedStack = selectedTech.filter(t => t !== tech);
    } else {
      // 🔹 Select: Add tech to selected list
      updatedStack = [...selectedTech, tech];
    }

    setSelectedTech(updatedStack);
    localStorage.setItem("techStack", JSON.stringify(updatedStack));
  };

  // 🔹 Handle Experience Level Selection
  const handleExperienceSelect = (level) => {
    setExperience(level);
    localStorage.setItem("experience", level);
  };

  // 🔹 Navigate to Projects Page
  const handleNext = () => {
    if (selectedTech.length === 0 || experience === "") {
      alert("Please select at least one tech stack and experience level!");
      return;
    }
    navigate("/create-project");
  };

  // 🔹 Filter Remaining Tech (Only Show Unselected Ones)
  const remainingTech = allTechStack.filter(tech => !selectedTech.includes(tech));

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold mb-6"
      >
        Select the tech stack for your project today!
      </motion.h1>

      {/* Selected Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedTech.map((tech, index) => (
          <span key={index} onClick={() => handleTechSelect(tech)} className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
            {tech}
          </span>
        ))}
      </div>

      {/* Tech Stack Selection */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {remainingTech.map((tech, index) => (
          <motion.button
            key={index}
            onClick={() => handleTechSelect(tech)}
            whileHover={{ scale: 1.1 }}
            className={`px-4 py-2 border rounded-lg transition-all 
              border-white text-white hover:bg-white hover:text-black`}
          >
            {tech}
          </motion.button>
        ))}
      </div>

      {/* Experience Level Selection */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-2xl mb-4"
      >
        Select Your Experience Level
      </motion.h2>

      <div className="flex gap-4">
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <button
            key={level}
            onClick={() => handleExperienceSelect(level)}
            className={`px-4 py-2 border border-white rounded-lg ${
              experience === level ? "bg-white text-black" : "text-white"
            } hover:bg-white hover:text-black`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="mt-6 px-6 py-3 text-lg font-bold bg-white text-black rounded-lg hover:bg-gray-300 transition-all"
      >
        Next
      </button>
    </div>
  );
}
