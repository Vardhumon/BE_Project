import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { question: "What's your name?", field: "name", type: "text" },
  { question: "What's your email?", field: "email", type: "email" },
  { question: "Create a password", field: "password", type: "password" },
  { question: "Select Your Tech Stack", field: "techStack", type: "multi-select" },
  { question: "What's your experience level?", field: "experienceLevel", type: "select" },
];

const techOptions = [
  "React", "Node.js", "MongoDB", "Express", "Python", "Java", "Machine Learning",
  "Django", "Vue.js", "Angular", "Ruby on Rails", "Flutter", "Go", "C++", "Swift",
];

const experienceLevels = ["Beginner", "Intermediate", "Expert"];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    techStack: [],
    experienceLevel: "",
  });

  const [step, setStep] = useState(0);

  const handleNext = () => step < steps.length - 1 && setStep(step + 1);
  const handlePrev = () => step > 0 && setStep(step - 1);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTechChange = (tech) => setFormData((prev) => ({
    ...prev,
    techStack: prev.techStack.includes(tech) ? prev.techStack.filter((t) => t !== tech) : [...prev.techStack, tech],
  }));
  const handleExperienceChange = (level) => setFormData({ ...formData, experienceLevel: level });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/signup", {
        ...formData,
        techStack: formData.techStack.join(", "),
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-transparent relative overflow-hidden">
      {/* Floating Elements */}
      <motion.div className="absolute top-10 right-20 w-32 h-32 bg-blue-400 opacity-30 blur-xl rounded-full" animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-10 left-20 w-24 h-24 bg-purple-400 opacity-30 blur-xl rounded-full" animate={{ x: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      
      {/* Signup Form */}
      <motion.div className="w-full max-w-lg p-8 bg-transparent backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl text-white relative" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-semibold text-center">{steps[step].question}</h2>
            
            {/* Input Fields */}
            {steps[step].type === "text" || steps[step].type === "email" || steps[step].type === "password" ? (
              <input type={steps[step].type} name={steps[step].field} value={formData[steps[step].field]} onChange={handleChange} className="w-full p-3 mt-6 bg-white/10 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" required />
            ) : steps[step].type === "multi-select" ? (
              <div className="flex flex-wrap gap-2 mt-6">
                {techOptions.map((tech) => (
                  <button key={tech} type="button" onClick={() => handleTechChange(tech)} className={`px-4 py-2 text-lg border rounded-lg ${formData.techStack.includes(tech) ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300"}`}>{tech}</button>
                ))}
              </div>
            ) : steps[step].type === "select" ? (
              <div className="flex gap-4 mt-6">
                {experienceLevels.map((level) => (
                  <button key={level} type="button" onClick={() => handleExperienceChange(level)} className={`px-4 py-2 text-lg border rounded-lg ${formData.experienceLevel === level ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300"}`}>{level}</button>
                ))}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={handlePrev} disabled={step === 0} className={`px-5 py-3 text-lg rounded-lg transition ${step === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-400"}`}>Previous</button>
          {step === steps.length - 1 ? (
            <button onClick={handleSubmit} className="px-5 py-3 text-lg bg-green-500 rounded-lg hover:bg-green-600 transition">Submit</button>
          ) : (
            <button onClick={handleNext} className="px-5 py-3 text-lg bg-blue-500 rounded-lg hover:bg-blue-600 transition">Next</button>
          )}
        </div>
        
        {/* Login Link */}
        <p className="mt-6 text-center text-gray-300">Already registered? <button onClick={() => navigate("/login")} className="text-blue-400 hover:underline">Login here</button></p>
      </motion.div>
    </div>
  );
};

export default Signup;
