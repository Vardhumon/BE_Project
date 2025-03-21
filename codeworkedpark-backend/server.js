const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const { cosineSimilarity, enhanceSteps } = require("./utils");
const { fetchDynamicResources } = require("./resourceServices");
const { Octokit } = require("@octokit/rest");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/codeworkedpark", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Schemas and Models
const taskSchema = new mongoose.Schema({
  title: String,
  summary: String,
  details: String,
});

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
  techStack: [{ type: String }],
  experienceLevel: { type: String, default: "" },
  projects: [
    {
      projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
      tasks: [taskProgressSchema],
    },
  ],
});
const User = mongoose.model("User", userSchema);

// Helper Functions
const recommendProjects = async (userTechStack) => {
  try {
    const projects = await Project.find({});
    const recommendations = projects.map((project) => {
      const intersection = project.tags.filter((tag) => userTechStack.includes(tag));
      const similarity = intersection.length / userTechStack.length;
      return { ...project.toObject(), similarity };
    });

    recommendations.sort((a, b) => b.similarity - a.similarity || b.stars - a.stars);
    return recommendations.slice(0, 10);
  } catch (err) {
    console.error("Failed to recommend projects:", err);
    return [];
  }
};

// Routes
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password, techStack } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, techStack });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user });
  } catch (err) {
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

const recommendedProjectsSession = new Set();

app.post("/api/getProject", async (req, res) => {
  const { userStack, experienceLevel } = req.body;
  console.log(userStack, experienceLevel);

  try {
    const projects = await Project.find();
    const filteredProjects = projects.filter((project) =>
      project.techStack.some((tech) => userStack.includes(tech))
    );

    const availableProjects = filteredProjects.filter(
      (project) => !recommendedProjectsSession.has(project._id.toString())
    );

    if (availableProjects.length === 0) {
      return res.status(200).json({ message: "No more projects to recommend" });
    }

    const randomIndex = Math.floor(Math.random() * availableProjects.length);
    const recommendedProject = availableProjects[randomIndex].toObject();

    recommendedProjectsSession.add(recommendedProject._id.toString());

    recommendedProject.steps = enhanceSteps(recommendedProject.steps, experienceLevel);
    recommendedProject.deadline =
      recommendedProject.difficultyLevel === "Easy"
        ? "1 week"
        : recommendedProject.difficultyLevel === "Medium"
        ? "2 weeks"
        : "3 weeks";

    res.status(200).json({ project: recommendedProject });
  } catch (err) {
    res.status(500).json({ message: "Error fetching project", error: err.message });
  }
});

app.post("/api/acceptProject", async (req, res) => {
  const { userId, projectId } = req.body;
  console.log(userId, projectId);
  try {
    const user = await User.findById(userId);
    console.log("user",user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isProjectAccepted = user.projects.some((p) => p.projectId.equals(projectId));
    if (isProjectAccepted) return res.status(400).json({ message: "Project already accepted" });

    user.projects.push({ projectId });
    await user.save();

    res.status(200).json({ message: "Project accepted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting project", error: err.message });
  }
});

app.post("/api/update-task-progress", async (req, res) => {
  const { userId, projectId, taskId, completed } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.projects.find((p) => p.projectId.equals(projectId));
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.find((t) => t.taskId.equals(taskId));
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = completed;
    await user.save();

    res.status(200).json({ message: "Task progress updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/getUserProjects", async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId).populate("projects.projectId");
    // console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out any null projectId values (in case of invalid references)
    const validProjects = user.projects
      .map(p => p.projectId)
      .filter(project => project !== null);

    res.status(200).json({ projects: validProjects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
});
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
