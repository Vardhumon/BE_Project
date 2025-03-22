const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const projects = require("./projects.json");
// const { cosineSimilarity, enhanceSteps } = require("./utils");
// const { fetchDynamicResources } = require("./resourceServices");
// const { Octokit } = require("@octokit/rest");
// const { exec } = require("child_process");

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());


const importProjects = async () => {
  try {
    const data = fs.readFileSync("projects.json", "utf-8"); // Read the file
    const projects = JSON.parse(data); // Parse JSON
    await Project.deleteMany();
    for (const project of projects) {
      const existingProject = await Project.findOne({ title: project.title });
      if (!existingProject) {
        await Project.create(project);
        console.log(`Added project: ${project.title}`);
      } else {
        console.log(`Project already exists: ${project.title}`);
      }
    }
    console.log("Project import complete.");
  } catch (error) {
    console.error("Error importing projects:", error);
  }
};


// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/codeworkedpark", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected")
    // await importProjects();
  })
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
}, { timestamps: true });
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
      repoUrl: { type: String },
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
    // console.log(filteredProjects);

    const availableProjects = filteredProjects.filter(
      (project) => !recommendedProjectsSession.has(project._id.toString())
    );
    // console.log(availableProjects);
    if (availableProjects.length === 0) {
      return res.status(200).json({ message: "No more projects to recommend" });
    }

    const randomIndex = Math.floor(Math.random() * availableProjects.length);
    const recommendedProject = availableProjects[randomIndex].toObject();
    // console.log(recommendedProject);
    recommendedProjectsSession.add(recommendedProject._id.toString());

    // recommendedProject.steps = enhanceSteps(recommendedProject.steps, experienceLevel);
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
  const { userId, projectId, repoUrl } = req.body;
  // console.log(userId, projectId, repoUrl);
  try {
    const user = await User.findById(userId);
    console.log(user.name);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    // console.log(project);

    // Check if project is already accepted
    const isProjectAccepted = user.projects.some((p) => p.projectId.equals(projectId));
    // console.log(user.projects);

    if (isProjectAccepted) return res.status(400).json({ message: "Project already accepted" });
    // Initialize tasks for the user
    const taskProgress = project.steps.map((step) => ({
      taskId: step._id, // Ensure the steps in Project schema have `_id` field
      completed: false,
    }));

    // Add project with initialized tasks
    user.projects.push({ projectId, repoUrl, tasks: taskProgress });
    await user.save();

    res.status(200).json({ message: "Project accepted successfully", repoUrl });
  } catch (err) {
    res.status(500).json({ message: "Error accepting project", error: err.message });
  }
});



app.post("/api/update-task-progress", async (req, res) => {
  const { userId, projectId, completedSteps } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.projects.find((p) => String(p.projectId) === String(projectId));
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Iterate over completed steps and update them
    for (const [stepId, subSteps] of Object.entries(completedSteps)) {
      const task = project.tasks.find((t) => String(t.taskId) === String(stepId));
      if (task) {
        task.completed = true;
      }
    }

    await user.save();
    res.status(200).json({ message: "Task progress updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.post("/api/getUserProjects", async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log(req.body);

    const user = await User.findById(userId).populate("projects.projectId");
    // console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out any null projectId values (in case of invalid references)
    const validProjects = user.projects
      .map(p => ({
        projectId: p.projectId, 
        repoUrl: p.repoUrl // Ensure repoUrl is included in the response
      }))
      .filter(project => project.projectId !== null);

    // console.log(validProjects);

    res.status(200).json({ projects: validProjects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
});


app.post("/api/getUserProgress", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch the user document
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract project progress
    const progress = user.projects.map((project) => ({
      projectId: project.projectId,
      tasks: project.tasks.map((task) => ({
        taskId: task.taskId,
        completed: task.completed,
      })),
    }));

    res.json({ progress });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/api/verifyGithubRepo", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    // Extract the owner and repo name from the URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return res.status(400).json({ verified: false, message: "Invalid GitHub URL." });
    }

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (response.status === 404) {
      return res.status(404).json({ verified: false, message: "Repository not found." });
    }

    if (!response.ok) {
      return res.status(500).json({ verified: false, message: "GitHub API error." });
    }

    const data = await response.json();

    if (!data.private) {
      return res.json({ verified: true });
    } else {
      return res.json({ verified: false, message: "Repository is private." });
    }
  } catch (error) {
    res.status(500).json({ verified: false, message: "Error verifying repository." });
  }
});

const submittedProjectSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  githubLink: String,
  deploymentLink: String,
  summary: String,
  community: String, // Example: "Full Stack", "ML", "AI"
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });

const SubmittedProject = mongoose.model("SubmittedProject", submittedProjectSchema);

app.post("/api/submitProject", async (req, res) => {
  const { userId,username, projectId, githubLink, deploymentLink, summary, community } = req.body;

  try {
      // Validate User
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Validate Project
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });

      // Check if project is already submitted by this user
      const existingSubmission = await SubmittedProject.findOne({ projectId, userId });
      if (existingSubmission) {
          return res.status(400).json({ message: "You have already submitted this project." });
      }

      // Create a new submission
      const submittedProject = new SubmittedProject({
          projectId,
          userId,
          username,
          githubLink,
          deploymentLink,
          summary,
          community,
          comments: [],
      });

      await submittedProject.save();

      res.status(201).json({ message: "Project submitted successfully", project: submittedProject });
  } catch (err) {
      res.status(500).json({ message: "Error submitting project", error: err.message });
  }
});


app.get("/api/community/:community", async (req, res) => {
  try {
    const { community } = req.params;
    const projects = await SubmittedProject.find({ community }).populate("projectId comments");

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching community posts", error: err.message });
  }
});

app.get("/api/getSubmittedProjects", async (req, res) => {
  try {
      const projects = await SubmittedProject.find().populate("projectId");
      res.json(projects);
  } catch (error) {
      res.status(500).json({ message: "Error fetching submitted projects" });
  }
});


const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

const commentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "SubmittedProject" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User joined project room: ${projectId}`);
  });

  socket.on("newComment", async ({ projectId, userId, comment }) => {
    try {
      const newComment = new Comment({ projectId, userId, comment });
      await newComment.save();

      // Emit to all users in the same project room
      io.to(projectId).emit("commentAdded", newComment);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/api/community/:category", async (req, res) => {
  const { category } = req.params;
  const projects = await Project.find({ category });
  res.json({ projects });
});


app.get("/api/user-projects/:userId", async (req, res) => {
  const { userId } = req.params;
  const projects = await Project.find({ userId });
  res.json({ projects });
});

app.post("/api/community-post", async (req, res) => {
  const { title, techStack, level, summary, link, category } = req.body;
  const project = new Project({ title, techStack, level, summary, link, category });
  await project.save();
  res.json({ success: true, project });
});


// Start server with WebSockets
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));