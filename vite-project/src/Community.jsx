import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const navigate = useNavigate();

  // Predefined communities with humorous descriptions
  const communities = [
    { name: "Full-Stack", slug: "full-stack", description: "Why choose one when you can suffer both frontend & backend?" },
    { name: "Backend", slug: "backend", description: "Where real developers live—frontend? Never heard of it." },
    { name: "Frontend", slug: "frontend", description: "Making things pretty while suffering inside (CSS nightmares included)." },
    { name: "Machine Learning", slug: "ml", description: "Turning data into magic, or just overfitting for fun." },
    { name: "Artificial Intelligence", slug: "ai", description: "Teaching computers to think—so we don’t have to." },
    { name: "DevOps", slug: "devops", description: "We break things so you don’t have to. Also, YAML." },
    { name: "Web3", slug: "web3", description: "Decentralized dreams & centralized errors. Welcome to the blockchain." },
  ];

  return (
    <motion.div
      className="w-full h-screen flex flex-col items-center justify-center bg-black text-white p-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 className="text-4xl font-bold mb-6 text-center">
        🚀 Choose Your Community
      </motion.h1>

      {/* Community Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl ">
        {communities.map((community, index) => (
          <motion.div
            key={community.slug}
            className="p-6 border border-white/20 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105 transition-all
               hover:bg-blue-700 hover:shadow-lg hover:shadow-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/community/${community.slug}`)}
          >
            <h2 className="text-2xl font-semibold">{community.name}</h2>
            <p className="text-gray-300 text-sm mt-2">{community.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
