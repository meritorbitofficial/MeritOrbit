"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProjectsPage() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [github, setGithub] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  /* 🔥 LOAD PROJECTS FROM FIREBASE */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUserId(user.uid);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      }
    });

    return () => unsub();
  }, []);

  /* ➕ ADD PROJECT */
  async function addProject() {
    if (!title) return;

    const newProject = {
      title,
      description,
      tech,
      github,
    };

    const updatedProjects = [...projects, newProject];

    setProjects(updatedProjects);

    await setDoc(
      doc(db, "users", userId),
      { projects: updatedProjects },
      { merge: true }
    );

    setTitle("");
    setDescription("");
    setTech("");
    setGithub("");
  }

  /* ❌ DELETE PROJECT */
  async function deleteProject(index: number) {
    const updatedProjects = projects.filter((_, i) => i !== index);

    setProjects(updatedProjects);

    await setDoc(
      doc(db, "users", userId),
      { projects: updatedProjects },
      { merge: true }
    );
  }

  return (
    <div>

      {/* PAGE TITLE */}
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "30px"
        }}
      >
        Projects
      </h1>

      {/* ADD PROJECT CARD */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "14px",
          marginBottom: "30px",
          maxWidth: "700px"
        }}
      >

        <h3 style={{ marginBottom: "20px" }}>
          Add Project
        </h3>

        <input
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            ...inputStyle,
            height: "100px"
          }}
        />

        <input
          placeholder="Tech Stack (Example: React, Node.js)"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="GitHub Link"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={addProject}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Add Project
        </button>

      </div>

      {/* PROJECT LIST */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "14px",
          maxWidth: "700px"
        }}
      >

        <h3 style={{ marginBottom: "20px" }}>
          Your Projects
        </h3>

        {projects.length === 0 && (
          <p>No projects added yet.</p>
        )}

        {projects.map((project, index) => (

          <div
            key={index}
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "15px"
            }}
          >

            <h4 style={{ marginBottom: "6px" }}>
              {project.title}
            </h4>

            <p style={{ marginBottom: "8px" }}>
              {project.description}
            </p>

            <p style={{ fontSize: "14px", marginBottom: "6px" }}>
              <b>Tech:</b> {project.tech}
            </p>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "green"
                }}
              >
                View GitHub
              </a>
            )}

            {/* 🔥 SMALL REMOVE BUTTON BELOW */}
            <button
              onClick={() => deleteProject(index)}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "4px 10px",
                fontSize: "12px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Remove
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

/* INPUT STYLE */
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};