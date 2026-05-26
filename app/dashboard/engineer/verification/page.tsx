"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function VerificationPage() {
  const [githubUsername, setGithubUsername] = useState("");
  const [githubConnected, setGithubConnected] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // 🔹 LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        if (data.githubConnected) {
          setGithubConnected(true);
          setGithubUsername(data.githubUsername || "");
        }

        setChallengeCompleted(data.challengeCompleted || false);
      }
    };

    loadData();
  }, []);

  // 🔹 CONNECT / UPDATE GITHUB
  const handleConnect = async () => {
    if (!githubUsername.trim()) {
      alert("Enter GitHub username");
      return;
    }

    try {
      setConnecting(true);

      // ✅ Validate GitHub username
      const res = await fetch(
        `https://api.github.com/users/${githubUsername}`
      );

      if (!res.ok) {
        alert("Invalid GitHub username");
        return;
      }

      const githubData = await res.json();

      if (githubData.public_repos < 1) {
        alert("GitHub must have at least 1 repo");
        return;
      }

      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);

      await setDoc(
        ref,
        {
          githubConnected: true,
          githubUsername: githubData.login,
          githubProfileUrl: githubData.html_url,
          githubRepos: githubData.public_repos,
        },
        { merge: true }
      );

      setGithubConnected(true);
      setShowForm(false);

    } catch (err) {
      console.error(err);
      alert("Error connecting GitHub");
    } finally {
      setConnecting(false);
    }
  };

  // 🔹 REMOVE GITHUB
  const handleRemove = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    await setDoc(
      ref,
      {
        githubConnected: false,
        githubUsername: "",
      },
      { merge: true }
    );

    setGithubConnected(false);
    setGithubUsername("");
  };

  const finalStatus =
    githubConnected && challengeCompleted ? "Verified" : "Incomplete";

  return (
    <div style={{ padding: "40px" }}>
      
      <h1 style={{ fontSize: "36px", marginBottom: "30px" }}>
        Engineer Verification
      </h1>

      {/* GitHub Section */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          marginBottom: "30px",
          maxWidth: "800px"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Connect GitHub</h3>

        <p style={{ marginBottom: "20px" }}>
          Connect your GitHub account to verify your engineering projects.
        </p>

        {!githubConnected && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "#111",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Connect GitHub
          </button>
        )}

        {!githubConnected && showForm && (
          <div>
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />

            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                background: "#111",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              {connecting ? "Connecting..." : "Confirm & Connect"}
            </button>
          </div>
        )}

        {githubConnected && (
          <div>
            <p style={{ marginBottom: "10px" }}>
              Connected as: <b>{githubUsername}</b>
            </p>

            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "#111",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              Change GitHub
            </button>

            <button
              onClick={handleRemove}
              style={{
                background: "#ccc",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Challenge */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          marginBottom: "30px",
          maxWidth: "800px"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Take Coding Challenge</h3>

        <p style={{ marginBottom: "20px" }}>
          Complete technical challenges to verify your engineering skills.
        </p>

        <Link href="/dashboard/engineer/challenges">
          <button
            style={{
              background: "#111",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Start Challenge
          </button>
        </Link>
      </div>

      {/* Status */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "800px"
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Verification Status</h3>

        <p style={{ marginBottom: "8px" }}>
          GitHub Connection:{" "}
          <b>{githubConnected ? "Connected" : "Pending"}</b>
        </p>

        <p style={{ marginBottom: "8px" }}>
          Coding Challenge:{" "}
          <b>{challengeCompleted ? "Completed" : "Not Started"}</b>
        </p>

        <p>
          Engineer Verification: <b>{finalStatus}</b>
        </p>
      </div>

    </div>
  );
}