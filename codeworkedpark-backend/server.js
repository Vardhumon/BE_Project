const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const projects = require("./projects.json");

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

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  stars: Number,
  tags: [String],
  codeQuality: Number,
  structure: [String],
  tasks: [taskSchema], // Breakdown of tasks
});

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