const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const projects = require("./projects.json");
const { cosineSimilarity,enhanceSteps } = require("./utils");
const { fetchDynamicResources } = require("./resourceServices");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/codeworkedpark", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Schema
const taskSchema = new mongoose.Schema({
  title: String,
  summary: String,
  details: String, // Detailed steps
});

// const projectSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   url: String,
//   stars: Number,
//   tags: [String],
//   codeQuality: Number,
//   structure: [String],
//   tasks: [taskSchema], // Breakdown of tasks
// });


const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  difficultyLevel: String,
  steps: [
    {
      step: String,
      subSteps: [String],
    },
  ],
  testingMetrics: [String],
  tag: String,
  enhancements: [String],
});
const Project = mongoose.model("Project", projectSchema);

const taskProgressSchema = new mongoose.Schema({
  taskId: mongoose.Schema.Types.ObjectId,
  completed: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  techStack: { type: String, default: "" },  // Changed to string to store comma-separated values
  experienceLevel: { type: String, default: "" },  // Added experienceLevel
  projects: [{
    projectId: mongoose.Schema.Types.ObjectId,
    tasks: [taskProgressSchema],
  }],
});


const User = mongoose.model("User", userSchema);


// Routes
app.get("/api/projects", (req, res) => {
  res.status(200).json(projects);
});
// Register (Signup)
app.post("/api/signup", async (req, res) => {
  const { name, email, password, techStack } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      techStack,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { exec } = require("child_process");

// Generate new projects endpoint
app.get("/api/generate-projects", async (req, res) => {
  exec("python3 ml/generate_projects.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ message: "Failed to generate projects" });
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).json({ message: "Failed to generate projects" });
    }

    // Parse the output from the Python script
    try {
      const newProjects = JSON.parse(stdout);
      res.status(200).json(newProjects);
    } catch (err) {
      console.error(`Error parsing new projects: ${err}`);
      res.status(500).json({ message: "Failed to parse new projects" });
    }
  });
});

// Recommendation endpoint
app.post("/api/recommend-projects", async (req, res) => {
  const { techStack } = req.body;

  // Call the Python script
  exec(`python3 ml/recommendation_model.py "${techStack}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ message: "Failed to generate recommendations" });
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).json({ message: "Failed to generate recommendations" });
    }

    // Parse the output from the Python script
    try {
      const recommendations = JSON.parse(stdout);
      res.status(200).json(recommendations);
    } catch (err) {
      console.error(`Error parsing recommendations: ${err}`);
      res.status(500).json({ message: "Failed to parse recommendations" });
    }
  });
});

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Add GITHUB_TOKEN to .env
});

// Verify repository endpoint
app.post("/api/verify-repo", async (req, res) => {
  const { repoUrl } = req.body;

  try {
    // Extract owner and repo name from URL
    const [owner, repo] = repoUrl.split("/").slice(-2);

    // Fetch repository details
    const { data: repoData } = await octokit.repos.get({ owner, repo });

    // Fetch commits (example: check if the latest commit passes tests)
    const { data: commits } = await octokit.repos.listCommits({ owner, repo });

    // TODO: Add logic to verify test cases (e.g., using GitHub Actions)

    res.status(200).json({ message: "Repository verified", repoData });
  } catch (err) {
    console.error("GitHub API error:", err);
    res.status(500).json({ message: "Failed to verify repository" });
  }
});


app.post("/api/complete-project", async (req, res) => {
  const { userId, project } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add project to user's profile
    user.projects.push(project);
    await user.save();

    res.status(200).json({ message: "Project completed", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




const recommendProjects = async (userTechStack) => {
  try {
    // Fetch all projects from the database
    const projects = await Project.find({});

    // Calculate similarity between user tech stack and project tags
    const recommendations = projects.map((project) => {
      const intersection = project.tags.filter((tag) => userTechStack.includes(tag));
      const similarity = intersection.length / userTechStack.length;
      return { ...project.toObject(), similarity };
    });

    // Sort by similarity and stars
    recommendations.sort((a, b) => {
      if (b.similarity === a.similarity) {
        return b.stars - a.stars;
      }
      return b.similarity - a.similarity;
    });

    return recommendations.slice(0, 10); // Return top 10 recommendations
  } catch (err) {
    console.error("Failed to recommend projects:", err);
    return [];
  }
};

app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("projects");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ projects: user.projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/api/recommend-projects", async (req, res) => {
  const { techStack } = req.body;

  try {
    const recommendations = await recommendProjects(techStack);
    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate recommendations" });
  }
});


app.post("/api/update-task-progress", async (req, res) => {
  const { userId, projectId, taskId, completed } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the project and task
    const project = user.projects.find((p) => p.projectId.equals(projectId));
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = project.tasks.find((t) => t.taskId.equals(taskId));
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task progress
    task.completed = completed;
    await user.save();

    res.status(200).json({ message: "Task progress updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Example of tech stack comparison function (this can be expanded as per your actual implementation)
function getTechVector(techStack, techList) {
  return techList.map(tech => techStack.includes(tech) ? 1 : 0);
}


// const enhancements = [
//   "Enable Multi-cluster Support",
//   "Implement Continuous Integration/Continuous Deployment (CI/CD) Pipelines",
//   "Add Blue-Green or Canary Deployments",
//   "Secure ArgoCD Access with OAuth2",
//   "Enable Automated Scaling of Applications",
//   "Implement Secrets Management with HashiCorp Vault",
//   "Add Custom Resource Definitions (CRDs)",
//   "Integrate Logging and Monitoring",
//   "Optimize Helm Chart Repositories",
//   "Implement GitOps Security Best Practices"
// ];

// // Helper function to get a random enhancement
// const getRandomEnhancement = (enhancements) => {
//   const randomIndex = Math.floor(Math.random() * enhancements.length);
//   return enhancements[randomIndex];
// };
// app.post("/api/getProject", async (req, res) => {
//   try {
//     const { userStack } = req.body; // Assuming the user's tech stack is passed in the request body
//     // console.log(userStack)
//     // List of all techs (to compare against)
//     const techList = ["ArgoCD", "Kubernetes", "Helm", "GitHub", "Jenkins", "Docker","React","ML"];
    
//     // Get all projects from the database
//     const projects = await Project.find();
//     // console.log(projects)
//     // Convert the user's tech stack to a binary vector
//     const userVector = getTechVector(userStack, techList);

//     // Compute similarity scores between the user's stack and each project
//     // const similarities = projects.map(project => {
//     //   const projectVector = getTechVector(project.techStack, techList);
//     //   return cosineSimilarity(userVector, projectVector);
//     // });
//     // console.log(similarities)
//     const similarities = projects.map(project => {
//       const projectVector = getTechVector(project.techStack, techList);
//       console.log("User vector:", userVector);
//       console.log("Project vector:", projectVector);
//       console.log("Cosine similarity:", cosineSimilarity(userVector, projectVector));
//       return cosineSimilarity(userVector, projectVector);
//     });



//     // Get the index of the most similar project
//     const bestProjectIndex = similarities.indexOf(Math.max(...similarities));
//     console.log(bestProjectIndex)
//     const bestProject = projects[bestProjectIndex];
//     console.log(bestProject)
//     // Select a random enhancement for the project
//     const randomEnhancement = getRandomEnhancement(enhancements);

//     // Assign a deadline based on difficulty level
//     let deadline;
//     switch (bestProject.difficultyLevel) {
//       case "Easy":
//         deadline = "1 week";
//         break;
//       case "Medium":
//         deadline = "2 weeks";
//         break;
//       case "Hard":
//         deadline = "3 weeks";
//         break;
//       default:
//         deadline = "2 weeks";
//     }

//     // Prepare the final response with all the necessary data
//     const finalProject = {
//       ...bestProject.toObject(),
//       enhancements: randomEnhancement,
//       deadline: deadline,
//     };

//     res.status(200).json(finalProject);
//   } catch (error) {
//     res.status(500).json({ message: "Error selecting project", error: error.message });
//   }
// });





// app.post("/api/getProject", async (req, res) => {
//   try {
//     const { userStack, experienceLevel } = req.body; // Added experience level

//     const techList = ["ArgoCD", "Kubernetes", "Helm", "GitHub", "Docker", "Terraform", "Jenkins"];
//     const projects = await Project.find();

//     const userVector = techList.map(tech => userStack.includes(tech) ? 1 : 0);
//     const similarities = projects.map(project => {
//       const projectVector = techList.map(tech => project.techStack.includes(tech) ? 1 : 0);
//       return cosineSimilarity(userVector, projectVector);
//     });

//     const bestProjectIndex = similarities.indexOf(Math.max(...similarities));
//     let bestProject = projects[bestProjectIndex].toObject();

//     // Apply dynamic enhancements based on user experience level
//     bestProject.steps = enhanceSteps(bestProject.steps, experienceLevel);

//     // Assign Deadline
//     bestProject.deadline = bestProject.difficultyLevel === "Easy" ? "1 week" : bestProject.difficultyLevel === "Medium" ? "2 weeks" : "3 weeks";

//     res.status(200).json(bestProject);
//   } catch (error) {
//     res.status(500).json({ message: "Error selecting project", error: error.message });
//   }
// });



app.post("/api/getProject", async (req, res) => {
  try {
    const { userStack, userId, experienceLevel } = req.body;
    
    const projects = await Project.find();
    const bestProject = projects[Math.floor(Math.random() * projects.length)].toObject();

    // Enhance steps with additional sub-steps
    bestProject.steps = await Promise.all(bestProject.steps.map(async step => {
      const dynamicResources = await fetchDynamicResources(step.step);
      return { ...step, resources: dynamicResources };
    }));

    // Assign Deadline
    bestProject.deadline = bestProject.difficultyLevel === "Easy" ? "1 week" : bestProject.difficultyLevel === "Medium" ? "2 weeks" : "3 weeks";

    // // Track user progress
    // let progress = await UserProgress.findOne({ userId, projectId: bestProject._id });
    // if (!progress) {
    //   progress = new UserProgress({ userId, projectId: bestProject._id, completedSteps: [], xp: 0 });
    //   await progress.save();
    // }

    res.status(200).json({ project: bestProject});
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
});
