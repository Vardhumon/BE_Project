const { Octokit } = require("@octokit/rest");
const mongoose = require("mongoose");
const eslint = require("eslint"); // For code quality analysis
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Project Schema
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  stars: Number,
  tags: [String],
  codeQuality: Number, // Code quality score (0-100)
  structure: [String], // Project structure (e.g., ["src/", "tests/", "README.md"])
});

const Project = mongoose.model("Project", projectSchema);

// GitHub API Client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Add GITHUB_TOKEN to .env
});

// Analyze code quality (example using ESLint)
const analyzeCodeQuality = async (code) => {
  const linter = new eslint.ESLint();
  const results = await linter.lintText(code);
  const errors = results[0].errorCount;
  const warnings = results[0].warningCount;
  return 100 - (errors + warnings); // Higher score = better quality
};

// Fetch and store GitHub projects
const scrapeGitHub = async () => {
  try {
    const topics = ["react", "nodejs", "python", "machine-learning", "javascript"];
    for (const topic of topics) {
      const { data: repos } = await octokit.search.repos({
        q: `topic:${topic}`,
        sort: "stars",
        order: "desc",
        per_page: 50, // Fetch top 50 repos per topic
      });

      for (const repo of repos.items) {
        // Fetch repository contents
        const { data: contents } = await octokit.repos.getContent({
          owner: repo.owner.login,
          repo: repo.name,
          path: "",
        });

        // Analyze code quality (example: analyze main file)
        let codeQuality = 0;
        if (contents.length > 0) {
          const file = contents.find((file) => file.name.endsWith(".js") || file.name.endsWith(".py"));
          if (file) {
            const { data: fileContent } = await octokit.repos.getContent({
              owner: repo.owner.login,
              repo: repo.name,
              path: file.path,
            });
            const code = Buffer.from(fileContent.content, "base64").toString("utf-8");
            codeQuality = await analyzeCodeQuality(code);
          }
        }

        // Fetch README and extract tasks
// Fetch README and extract detailed steps
const extractTaskDetails = async (owner, repo, taskTitle) => {
  try {
    const { data: readme } = await octokit.repos.getReadme({
      owner,
      repo,
    });
    const readmeContent = Buffer.from(readme.content, "base64").toString("utf-8");

    // Extract detailed steps (example: look for sections related to the task)
    const lines = readmeContent.split("\n");
    let details = "";
    let foundTask = false;

    for (const line of lines) {
      if (line.includes(taskTitle)) {
        foundTask = true;
      }
      if (foundTask && (line.startsWith("### ") || line.startsWith("- "))) {
        details += line + "\n";
      }
    }

    return details;
  } catch (err) {
    console.error("Failed to extract task details from README:", err);
    return "";
  }
};

// Update task extraction logic
const tasks = [];
const lines = readmeContent.split("\n");
for (const line of lines) {
  if (line.startsWith("## ") || line.startsWith("- ")) {
    const taskTitle = line.replace("## ", "").replace("- ", "");
    const details = await extractTaskDetails(owner, repo, taskTitle);
    tasks.push({
      title: taskTitle,
      summary: line,
      details,
    });
  }
}

// Update project saving logic
const project = new Project({
  title: repo.name,
  description: repo.description,
  url: repo.html_url,
  stars: repo.stargazers_count,
  tags: repo.topics,
  codeQuality,
  structure: contents.map((file) => file.path),
  tasks: await extractTasksFromReadme(repo.owner.login, repo.name),
});
        await project.save();
      }
    }

    console.log("GitHub scraping and analysis completed!");
  } catch (err) {
    console.error("GitHub scraping failed:", err);
  }
};

// Run scraping script periodically
const cron = require("node-cron");
cron.schedule("0 0 * * *", scrapeGitHub); // Run at midnight every day



// Initial scrape
scrapeGitHub();