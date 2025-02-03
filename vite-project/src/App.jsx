// // import React, { useState } from "react";
// // import Login from "./Login";
// // import Signup from "./Signup";
// // import UserProfile from "./UserProfile";
// // // import Notifications from "./Notifications";
// // // import Leaderboard from "./Leaderboard";
// // import ProjectRecommendation from "./ProjectRecommendation";
// // import Projects from "./Projects";

// // function App() {
// //   const [user, setUser] = useState(null);

// //   const handleLogin = (token, user) => {
// //     localStorage.setItem("token", token);
// //     setUser(user);
// //   };

// //   const handleSignup = (token, user) => {
// //     localStorage.setItem("token", token);
// //     setUser(user);
// //   };

// //   return (
// //     // <div className="min-h-screen bg-gray-100">
// //     //   {!user ? (
// //     //     <div className="flex flex-col items-center justify-center min-h-screen">
// //     //       <Login onLogin={handleLogin} />
// //     //       <Signup onSignup={handleSignup} />
// //     //     </div>
// //     //   ) : (
// //     //     <div className="p-8">
// //     //       <h1 className="text-3xl font-bold text-center mb-8">CodeWorkedPark</h1>
// //     //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //     //         <UserProfile user={user} />
// //     //         {/* <Notifications user={user} />
// //     //         <Leaderboard /> */}
// //     //         <ProjectRecommendation user={user} />
// //     //       </div>
// //     //     </div>
// //     //   )}
// //     // </div>
// //     <div><Projects/></div>
// //   );
// // }

// // export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import ProjectRecommendation from "./ProjectRecommendation";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<ProjectRecommendation />} />
//         {/* <Route path="/project/:id" element={<ProjectDetails />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import UserProfile from "./UserProfile";
import ProjectRecommendation from "./ProjectRecommendation";
import View from "./View";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, set the user (you may need to fetch user details using the token)
      setUser({ token });  // Assuming token is enough for now, you can enhance this to fetch user info from an API
    }
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const handleSignup = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Please Log In or Sign Up</h1>
            <div className="flex gap-4">
              <Login onLogin={handleLogin} />
              <Signup onSignup={handleSignup} />
            </div>
          </div>
        ) : (
          <div className="">
            <h1 className="text-3xl font-bold text-center mb-8">CodeWorkedPark</h1>
            <div className="flex">
              {/* <UserProfile user={user} /> */}
              <ProjectRecommendation user={user} />
              {/* <View /> */}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
