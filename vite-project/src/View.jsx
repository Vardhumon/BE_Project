// import { useState, useEffect } from "react";
// import axios from "axios";

// // export default function View() {
// //   const [project, setProject] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const fetchProject = () => {
// //     setLoading(true);
// //     axios
// //       .post("http://localhost:5000/api/getProject", {
// //         userStack: ["Github"], // Example user stack
// //         userId: "12345",
// //         experienceLevel: "Intermediate",
// //       })
// //       .then((res) => {
// //         setProject(res.data.project);
// //         console.log(res.data)
// //         setLoading(false);
// //       })
// //       .catch((err) => {
// //         setError(err.message);
// //         setLoading(false);
// //       });
// //   };

// //   useEffect(() => {
// //     fetchProject();
// //   }, []);

// //   if (loading) return <p className="text-center text-gray-500">Loading project...</p>;
// //   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

// //   return (
// //     <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 border border-gray-200 relative">
// //       {/* New Project Button in Top Right */}
// //       <button
// //         className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
// //         onClick={fetchProject}
// //       >
// //         New Project
// //       </button>

// //       <h1 className="text-2xl font-bold text-gray-800 mt-4">{project.title}</h1>
// //       <p className="text-gray-600 mt-2">{project.description}</p>

// //       <div className="mt-4">
// //         <h2 className="text-lg font-semibold text-gray-700">Tech Stack:</h2>
// //         <div className="flex flex-wrap gap-2 mt-2">
// //           {project.techStack.map((tech, index) => (
// //             <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full">
// //               {tech}
// //             </span>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Project Steps & Sub-Steps */}
// //       <div className="mt-6">
// //         <h2 className="text-lg font-semibold text-gray-700">Project Steps:</h2>
// //         <div className="space-y-4 mt-2">
// //           {project.steps.map((step, index) => (
// //             <div key={index} className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-md">
// //               <h3 className="font-semibold text-gray-800">{step.step}</h3>

// //               {/* Sub-Steps */}
// //               <ul className="list-disc list-inside text-gray-600 mt-2 pl-4">
// //                 {step.subSteps.map((subStep, i) => (
// //                   <li key={i} className="text-gray-700">{subStep}</li>
// //                 ))}
// //               </ul>

// //               {/* Resources */}
// //               <h4 className="font-medium text-blue-700 mt-3">Resources:</h4>
// //               <ul className="list-disc list-inside text-blue-500">
// //                 {step.resources.map((resource, i) => (
// //                   <li key={i}>
// //                     <a href={resource.url} target="_blank" rel="noopener noreferrer" className="underline">
// //                       {resource.title}
// //                     </a>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="mt-6 flex justify-between text-gray-600">
// //         <span className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full">{project.tag}</span>
// //         <span className="font-medium">Deadline: {project.deadline}</span>
// //       </div>
// //     </div>
// //   );
// // }


// export default function View() {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [accepting, setAccepting] = useState(false);
//   const [accepted, setAccepted] = useState(false); // Track if the project is accepted

//   const fetchProject = () => {
//     setLoading(true);
//     axios
//       .post("http://localhost:5000/api/getProject", {
//         userStack: ["Github"], // Example user stack
//         userId: "12345",
//         experienceLevel: "Intermediate",
//       })
//       .then((res) => {
//         setProject(res.data.project);
//         console.log(res.data)
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchProject();
//   }, []);

//   const acceptProject = () => {
//     setAccepting(true);
//     axios
//       .post("http://localhost:5000/api/acceptProject", {
//         userId: "679f4c0b62462cb876bafceb",
//         projectId: project._id,
//       })
//       .then(() => {
//         setAccepted(true);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Error accepting project.");
//       })
//       .finally(() => {
//         setAccepting(false);
//       });
//   };

//   if (loading) return <p className="text-center text-gray-500">Loading project...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 border border-gray-200 relative">
//       <button
//         className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//         onClick={fetchProject}
//       >
//         New Project
//       </button>

//       <h1 className="text-2xl font-bold text-gray-800 mt-4">{project.title}</h1>
//       <p className="text-gray-600 mt-2">{project.description}</p>

//       <div className="mt-4">
//         <h2 className="text-lg font-semibold text-gray-700">Tech Stack:</h2>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {project.techStack.map((tech, index) => (
//             <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full">
//               {tech}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="mt-6">
//         <h2 className="text-lg font-semibold text-gray-700">Project Steps:</h2>
//         <div className="space-y-4 mt-2">
//           {project.steps.map((step, index) => (
//             <div key={index} className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-md">
//               <h3 className="font-semibold text-gray-800">{step.step}</h3>
//               <ul className="list-disc list-inside text-gray-600 mt-2 pl-4">
//                 {step.subSteps.map((subStep, i) => (
//                   <li key={i} className="text-gray-700">{subStep}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-6 flex justify-between items-center">
//         <span className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full">{project.tag}</span>
//         <span className="font-medium">Deadline: {project.deadline}</span>
//       </div>

//       {/* Accept Project Button */}
//       {!accepted ? (
//         <button
//           className="mt-6 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//           onClick={acceptProject}
//           disabled={accepting}
//         >
//           {accepting ? "Accepting..." : "Accept Project"}
//         </button>
//       ) : (
//         <p className="mt-6 text-green-600 font-semibold text-center">Project Accepted!</p>
//       )}
//     </div>
//   );
// }



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

  const fetchProject = () => {
    setLoading(true);
    const userStack = JSON.parse(localStorage.getItem("techStack")) || ["Github"];
    const userId = localStorage.getItem("userId") || "12345";
    const experienceLevel = localStorage.getItem("experienceLevel") || "Intermediate";

    axios
      .post("http://localhost:5000/api/getProject", {
        userStack,
        userId,
        experienceLevel,
      })
      .then((res) => {
        setProject(res.data.project);
        console.log(res.data);
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
    setAccepting(true);
    axios
      .post("http://localhost:5000/api/acceptProject", {
        userId: "679f4c0b62462cb876bafceb",
        projectId: project._id,
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