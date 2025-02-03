// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { motion } from "framer-motion";
// // import ProgressChart from "./ProgressChart";

// // const ProjectRecommendation = ({ user }) => {
// //   const [projects, setProjects] = useState([]);
// //   const [selectedTask, setSelectedTask] = useState(null);

// //   useEffect(() => {
// //     if (user?.techStack) {
// //       axios
// //         .post("http://localhost:5000/api/recommend-projects", {
// //           techStack: user.techStack,
// //         })
// //         .then((response) => setProjects(response.data))
// //         .catch((err) => console.error("Failed to fetch projects:", err));
// //     }
// //   }, [user]);

// //   const handleTaskCompletion = async (projectId, taskId, completed) => {
// //     try {
// //       await axios.post("http://localhost:5000/api/update-task-progress", {
// //         userId: user._id,
// //         projectId,
// //         taskId,
// //         completed,
// //       });
// //       console.log("Task progress updated");
// //     } catch (err) {
// //       console.error("Failed to update task progress:", err);
// //     }
// //   };

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 50 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.5 }}
// //       className="bg-white p-6 rounded-lg shadow-md"
// //     >
// //       <h2 className="text-2xl font-bold mb-4">Recommended Projects</h2>
// //       <ul>
// //         {projects.map((project, index) => (
// //           <motion.li
// //             key={index}
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5, delay: index * 0.1 }}
// //             className="mb-6"
// //           >
// //             <h3 className="text-xl font-semibold">
// //               <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
// //                 {project.title}
// //               </a>
// //             </h3>
// //             <p className="text-sm text-gray-600">Technologies: {project.tags.join(", ")}</p>
// //             <div className="mt-4">
// //               {project.tasks.map((task, i) => (
// //                 <motion.div
// //                   key={i}
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   transition={{ duration: 0.5, delay: i * 0.1 }}
// //                   className="p-4 mb-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
// //                   onClick={() => setSelectedTask(task)}
// //                 >
// //                   <h4 className="text-lg font-medium">{task.title}</h4>
// //                   <p className="text-sm text-gray-600">{task.summary}</p>
// //                   <div className="mt-2">
// //                     <input
// //                       type="checkbox"
// //                       checked={task.completed}
// //                       onChange={(e) => handleTaskCompletion(project._id, task._id, e.target.checked)}
// //                       className="mr-2"
// //                     />
// //                     <span className="text-sm text-gray-600">Mark as completed</span>
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>
// //             <div className="mt-4">
// //               <ProgressChart completed={project.tasks.filter((t) => t.completed).length} total={project.tasks.length} />
// //             </div>
// //           </motion.li>
// //         ))}
// //       </ul>
// //       {selectedTask && (
// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           transition={{ duration: 0.3 }}
// //           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
// //           onClick={() => setSelectedTask(null)}
// //         >
// //           <motion.div
// //             initial={{ scale: 0.8 }}
// //             animate={{ scale: 1 }}
// //             transition={{ duration: 0.3 }}
// //             className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <h3 className="text-xl font-bold mb-4">{selectedTask.title}</h3>
// //             <p className="text-sm text-gray-600">{selectedTask.details}</p>
// //             <button
// //               onClick={() => setSelectedTask(null)}
// //               className="mt-4 w-full className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300>
// //               Close
// //             </button>
// //           </motion.div>
// //         </motion.div>
// //       )}
// //     </motion.div>
// //   );
// // };

// // export default ProjectRecommendation;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import ProgressChart from "./ProgressChart";

// const ProjectRecommendation = ({ user }) => {
//   const [projects, setProjects] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/projects")
//       .then((response) => setProjects(response.data))
//       .catch((err) => console.error("Failed to fetch projects:", err));
//     console.log(projects);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="bg-white p-6 rounded-lg shadow-md"
//     >
//       <h2 className="text-2xl font-bold mb-4">Recommended Projects</h2>
//       <ul>
//         {projects.map((project, index) => (
//           <motion.li
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//             className="mb-6"
//           >
//             <h3 className="text-xl font-semibold">{project.title}</h3>
//             <p className="text-sm text-gray-600">{project.description}</p>
//             <p className="text-sm text-gray-600">
//               <strong>Tech Stack:</strong> {project.techStack.join(", ")}
//             </p>
//             <div className="mt-4">
//               <h4 className="text-lg font-medium">Steps to Implement:</h4>
//               <ul className="list-disc list-inside text-sm text-gray-600">
//                 {project.steps.map((step, i) => (
//                   <li key={i}>{step}</li>
//                 ))}
//               </ul>
//             </div>
//             <div className="mt-4">
//               <h4 className="text-lg font-medium">Testing and Evaluation Metrics:</h4>
//               <ul className="list-disc list-inside text-sm text-gray-600">
//                 {project.testingMetrics.map((metric, i) => (
//                   <li key={i}>{metric}</li>
//                 ))}
//               </ul>
//             </div>
//           </motion.li>
//         ))}
//       </ul>
//     </motion.div>
//   );
// };

// export default ProjectRecommendation;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ProjectRecommendation = ({ user }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/projects")
      .then((response) => setProjects(response.data))
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-10 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Recommended Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 hover:scale-105 transition transform duration-300"
          >
            <h3 className="text-xl font-semibold text-white text-center mb-2">
              {index} {project.title}
            </h3>
            <p className="text-gray-300 text-sm text-center mb-4">
              {project.description}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Tech Stack:</strong> {project.techStack.join(", ")}
            </p>

            <div className="mt-4">
              <h4 className="text-lg font-medium text-white mb-2">
                Steps to Implement:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {project.steps.map((stepObj, i) => (
                  <li key={i} className="mb-1">
                    <strong>{stepObj.step}</strong>
                    {stepObj.subSteps && (
                      <ul className="list-disc list-inside ml-4 text-gray-400">
                        {stepObj.subSteps.map((subStep, j) => (
                          <li key={j}>{subStep}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-medium text-white mb-2">
                Testing & Evaluation Metrics:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {project.testingMetrics.map((metric, i) => (
                  <li key={i}>{metric}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectRecommendation;
