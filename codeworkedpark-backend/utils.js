// utils.js
function cosineSimilarity(vec1, vec2) {
    const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val ** 2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val ** 2, 0));
  
    // If either vector has zero magnitude, return 0
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
  
    const dotProduct = vec1.reduce((acc, val, index) => acc + val * vec2[index], 0);
    return dotProduct / (magnitude1 * magnitude2);
  }
  

  // utils.js

const enhancementPool = {
  beginner: [
    "Add detailed comments for every function.",
    "Use a step-by-step guide to set up dependencies.",
    "Explain core concepts before implementing features.",
    "Include example YAML files for reference.",
    "Provide screenshots of each setup step."
  ],
  intermediate: [
    "Implement unit tests for critical functionalities.",
    "Use environment variables for sensitive configurations.",
    "Set up a logging mechanism to track errors.",
    "Optimize performance by reducing redundant API calls."
  ],
  advanced: [
    "Implement a CI/CD pipeline for automatic deployment.",
    "Use infrastructure-as-code tools like Terraform.",
    "Ensure security best practices like OAuth authentication.",
    "Introduce microservices architecture if applicable."
  ]
};

const alternativeApproaches = {
  "Automate deployments": [
    "Use GitHub Actions instead of ArgoCD’s built-in sync.",
    "Implement blue-green deployments for zero downtime.",
    "Use GitOps with Flux instead of ArgoCD."
  ],
  "Monitor and rollback changes": [
    "Integrate Prometheus and Grafana for monitoring.",
    "Use Loki for centralized logging.",
    "Implement canary deployments instead of full rollbacks."
  ]
};

/**
 * Enhances project steps dynamically.
 */
function enhanceSteps(steps, difficultyLevel) {
  return steps.map(step => {
    let newSubsteps = [...step.subSteps];

    // Add a difficulty-based enhancement
    let difficultyEnhancements = enhancementPool[difficultyLevel.toLowerCase()];
    if (difficultyEnhancements) {
      newSubsteps.push(difficultyEnhancements[Math.floor(Math.random() * difficultyEnhancements.length)]);
    }

    // Add alternative approaches if applicable
    if (alternativeApproaches[step.step]) {
      newSubsteps.push(alternativeApproaches[step.step][Math.floor(Math.random() * alternativeApproaches[step.step].length)]);
    }

    return { step: step.step, subSteps: newSubsteps };
  });
}

module.exports = { cosineSimilarity, enhanceSteps };

  
  