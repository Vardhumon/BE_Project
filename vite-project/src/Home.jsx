import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black text-white overflow-hidden">
      {/* Background Floating Elements - Covers the Whole Screen */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: i * 0.8 }}
            className="absolute bg-blue-500 rounded-full blur-3xl"
            style={{
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-bold"
      >
        Welcome to CodeWorked Park
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-lg text-gray-300 mt-4 max-w-lg text-center"
      >
        A place where developers get AI-powered project suggestions and collaborate to build amazing things!
      </motion.p>

      {/* Updated Get Started Button with Glow Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-6 relative"
      >
        <button
          onClick={() => navigate("/choices")}
          className="relative px-6 py-3 text-lg font-bold bg-transparent text-white border-2 border-white rounded-lg transition-all hover:bg-white hover:text-black"
        >
          Create Project
          {/* Outer Glow Effect */}
          <span className="absolute inset-0 rounded-lg border-2 border-white opacity-40 group-hover:opacity-100 transition-all blur-lg"></span>
        </button>
      </motion.div>
    </div>
  );
}
