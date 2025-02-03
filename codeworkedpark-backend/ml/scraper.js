require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { ESLint } = require("eslint");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Project Schema
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  stars: Number,
  tags: [String],
  codeQuality: Number,
  structure: [String],
  tasks: [{ title: String, summary: String, details: String }],
});

const Project = mongoose.model("Project", projectSchema);

// Initialize GitHub API Client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Function to analyze code quality using ESLint
const analyzeCodeQuality = async (code) => {
  try {
    const linter = new ESLint({ useEslintrc: false });
    const results = await linter.lintText(code);
    const errors = results[0]?.errorCount || 0;
    const warnings = results[0]?.warningCount || 0;
    return Math.max(0, 100 - (errors + warnings * 0.5));
  } catch (err) {
    console.error("ESLint analysis failed:", err.message);
    return 50; // Default score if analysis fails
  }
};

// Extract meaningful tasks from README
const extractTasksFromReadme = async (owner, repo) => {
  try {
    const { data: readme } = await octokit.repos.getReadme({ owner, repo });
    const content = Buffer.from(readme.content, "base64").toString("utf-8");
    const lines = content.split("\n");
    
    let tasks = [];
    let currentTask = null;

    lines.forEach((line) => {
      if (line.startsWith("## ")) {
        if (currentTask) tasks.push(currentTask);
        currentTask = { title: line.replace("## ", ""), summary: "", details: "" };
      } else if (currentTask) {
        currentTask.details += line + "\n";
      }
    });

    if (currentTask) tasks.push(currentTask);
    return tasks;
  } catch (err) {
    console.error("Failed to extract tasks from README:", err.message);
    return [];
  }
};

// Fetch repositories and store in MongoDB
const scrapeGitHub = async () => {
  try {
    const topics = ["react", "nodejs", "python", "machine-learning", "javascript"];

    for (const topic of topics) {
      const { data: repos } = await octokit.search.repos({
        q: `topic:${topic}`,
        sort: "stars",
        order: "desc",
        per_page: 20, // Reduce to avoid rate limits
      });

      for (const repo of repos.items) {
        // Fetch repo structure
        let structure = [];
        try {
          const { data: contents } = await octokit.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: "",
          });

          structure = contents.map((file) => file.path);
        } catch (err) {
          console.warn(`Failed to get structure for ${repo.name}`);
        }

        // Analyze code quality
        let codeQuality = 50;
        try {
          const { data: file } = await octokit.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: "index.js",
          });

          const code = Buffer.from(file.content, "base64").toString("utf-8");
          codeQuality = await analyzeCodeQuality(code);
        } catch (err) {
          console.warn(`Skipping code quality check for ${repo.name}`);
        }

        // Extract tasks from README
        const tasks = await extractTasksFromReadme(repo.owner.login, repo.name);

        // Save project to database
        await Project.findOneAndUpdate(
          { url: repo.html_url },
          {
            title: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            tags: repo.topics,
            codeQuality,
            structure,
            tasks,
          },
          { upsert: true }
        );
      }
    }

    console.log("GitHub scraping completed!");
  } catch (err) {
    console.error("GitHub scraping failed:", err.message);
  }
};

// Run at midnight every day
cron.schedule("0 0 * * *", scrapeGitHub);

// Start scraping on server start
scrapeGitHub();

// Export the Project model for use in server.js
module.exports = Project;
