import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden px-6">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 0.7, scale: 1, y: -50 }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: i * 0.8 }}
            className="absolute bg-blue-500 rounded-full blur-3xl"
            style={{
              width: `${30 + i * 30}px`,
              height: `${30 + i * 30}px`,
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
        className="text-4xl md:text-6xl font-bold text-center z-10"
      >
        Welcome to CodeWorked Park
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-lg text-gray-300 mt-4 max-w-xl text-center z-10"
      >
        Your AI-powered coding hub! Get project suggestions, collaborate, and enhance your skills.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 1 }}
  className="mt-6 z-10 flex space-x-4"
>
  <button
    onClick={() => navigate("/choices")}
    className="px-6 py-3 text-lg font-bold bg-blue-600 text-white rounded-lg transition-all
               hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50"
  >
    Create Project
  </button>
  <button
    onClick={() => navigate("/community")}
    className="px-6 py-3 text-lg font-bold bg-gray-800 text-white border border-gray-600 rounded-lg transition-all
               hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-500/50"
  >
    Join Community
  </button>
</motion.div>


      {/* Features Section */}
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.2, delay: 1.5 }}
  className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
>
  {/* Feature 1 */}
  <div className="p-6 bg-[#1E1E1E]/90 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg transition-all
                 hover:shadow-xl hover:shadow-blue-500/50">
    <h2 className="text-xl font-semibold">🚀 AI-Powered Project Ideas</h2>
    <p className="text-gray-300 mt-2">
      Get personalized project suggestions based on your tech stack.
    </p>
  </div>

  {/* Feature 2 */}
  <div className="p-6 bg-[#1E1E1E]/90 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg transition-all
                 hover:shadow-xl hover:shadow-green-500/50">
    <h2 className="text-xl font-semibold">🤝 Collaborate with Developers</h2>
    <p className="text-gray-300 mt-2">
      Join a thriving community to work on real-world projects together.
    </p>
  </div>

  {/* Feature 3 */}
  <div className="p-6 bg-[#1E1E1E]/90 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg transition-all
                 hover:shadow-xl hover:shadow-purple-500/50">
    <h2 className="text-xl font-semibold">📈 Track Your Progress</h2>
    <p className="text-gray-300 mt-2">
      Set deadlines, deploy projects, and showcase your work.
    </p>
  </div>
</motion.div>



      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="mt-16 text-gray-500 text-sm text-center z-10"
      >
        © {new Date().getFullYear()} CodeWorked Park. All rights reserved.
      </motion.footer>
    </div>
  );
}
