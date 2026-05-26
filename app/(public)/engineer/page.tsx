"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

/* VERIFIED BADGE */
function VerifiedBadge({ type }: { type: "grey" | "blue" | "gold" }) {
  const colors = {
    grey: "#9ca3af",
    blue: "#1d9bf0",
    gold: "#facc15",
  };

  return (
    <span style={{ marginLeft: "8px", display: "inline-flex" }}>
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          fill={colors[type]}
          d="M12 2.5l2.2 1.5 2.7-.3 1.5 2.2 2.6.9.3 2.7 2.2 1.5-1.5 2.2.3 2.7-2.2 1.5-.9 2.6-2.7.3-1.5 2.2-2.2-1.5-2.7.3-1.5-2.2-2.6-.9-.3-2.7-2.2-1.5 1.5-2.2-.3-2.7 2.2-1.5.9-2.6 2.7-.3z"
        />
        <path
          fill="white"
          d="M10.2 14.6l-2.1-2.1-1.2 1.2 3.3 3.3 7-7-1.2-1.2z"
        />
      </svg>
    </span>
  );
}

export default function PublicProfile() {
  const params = useParams();
  const username = params.username;

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(!saved);
    console.log("Saved engineer:", username);
  }

  function handleSend() {
    console.log("Opportunity sent to:", username);
    alert("Opportunity sent successfully");
  }

  /* TEMP DATA */
  const engineer = {
    name: "Syed Baba Fakruddin",
    role: "Software Engineer",
    score: 182,
    badge: "gold",
    bio: "Software engineer focused on building scalable products and solving real-world problems.",
    skills: ["React", "Node.js", "Machine Learning"],
    projects: [
      {
        title: "AI Chatbot",
        desc: "Built an intelligent chatbot using NLP and modern AI tools.",
      },
      {
        title: "Job Platform",
        desc: "Developed a hiring platform connecting engineers and recruiters.",
      },
    ],
    links: {
      github: "https://github.com/syed",
      portfolio: "https://syed.dev",
    },
  };

  return (
    <div style={container}>
      
      {/* HEADER */}
      <div style={header}>
        <div style={avatar} />

        <div>
          <h1 style={{ display: "flex", alignItems: "center" }}>
            {engineer.name}
            <VerifiedBadge type={engineer.badge as any} />
          </h1>

          <p style={sub}>{engineer.role}</p>
          <p style={score}>Merit Score: {engineer.score}</p>
        </div>
      </div>

      {/* ABOUT */}
      <div style={card}>
        <h3>About</h3>
        <p>{engineer.bio}</p>
      </div>

      {/* SKILLS */}
      <div style={card}>
        <h3>Skills</h3>

        <div style={row}>
          {engineer.skills.map((skill, i) => (
            <span key={i} style={tag}>{skill}</span>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <div style={card}>
        <h3>Projects</h3>

        {engineer.projects.map((p, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <strong>{p.title}</strong>
            <p style={{ color: "#555" }}>{p.desc}</p>
          </div>
        ))}
      </div>

      {/* LINKS */}
      <div style={card}>
        <h3>Links</h3>

        <p>
          <a href={engineer.links.github} target="_blank">
            GitHub
          </a>
        </p>

        <p>
          <a href={engineer.links.portfolio} target="_blank">
            Portfolio
          </a>
        </p>
      </div>

      {/* ACTIONS */}
      <div style={actions}>
        <button onClick={handleSend} style={primaryBtn}>
          Send Opportunity
        </button>

        <button
          onClick={handleSave}
          style={{
            ...secondaryBtn,
            background: saved ? "#22c55e" : "#eee",
            color: saved ? "white" : "black",
          }}
        >
          {saved ? "Saved" : "Save Engineer"}
        </button>
      </div>

    </div>
  );
}

/* STYLES */

const container = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "20px",
};

const header = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const avatar = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "#e5e5e5",
};

const sub = { color: "#555" };

const score = { marginTop: "6px" };

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const row = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
};

const tag = {
  background: "#eee",
  padding: "6px 12px",
  borderRadius: "6px",
};

const actions = {
  display: "flex",
  gap: "12px",
};

const primaryBtn = {
  flex: 1,
  padding: "14px",
  background: "#22c55e",
  color: "white",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const secondaryBtn = {
  flex: 1,
  padding: "14px",
  background: "#eee",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};