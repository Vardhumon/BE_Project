import React, { useState } from "react";
import axios from "axios";

const GitHubVerification = ({ user }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/verify-repo", {
        repoUrl,
      });
      setVerificationResult(response.data);
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  return (
    <div className="github-verification">
      <h2>GitHub Repository Verification</h2>
      <input
        type="text"
        placeholder="Enter GitHub repository URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
      {verificationResult && (
        <div>
          <h3>Verification Result</h3>
          <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GitHubVerification;