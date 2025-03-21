import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Navbar appears after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 1 }}
      className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-50 
                 bg-black/30 backdrop-blur-md shadow-md border-b border-white/10 mb-5"
    >
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-white hover:text-gray-300 transition-all">
        CodeWorkedPark
      </Link>

      {/* User Icon */}
      {user && (
        <FaUserCircle
          className="text-3xl cursor-pointer text-white hover:text-gray-300 transition-all"
          onClick={() => navigate("/profile")}
        />
      )}
    </motion.nav>
  );
}
