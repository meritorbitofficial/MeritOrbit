"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Skill = {
  name: string;
  category: string;
};

const skills: Skill[] = [
  { name: "Java", category: "Language" },
  { name: "Python", category: "Language" },
  { name: "JavaScript", category: "Language" },
  { name: "C++", category: "Language" },
  { name: "C", category: "Language" },
  { name: "TypeScript", category: "Language" },
  { name: "Go (Golang)", category: "Language" },
  { name: "Rust", category: "Language" },
  { name: "SQL", category: "Language" },
];


export default function ChallengePage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleStart = (skillName: string) => {
  setSelectedSkill(skillName);

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        Skill Challenges
      </h1>

      <p style={{ marginBottom: "30px", maxWidth: "700px" }}>
  Select a skill challenge.
</p>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {skills.map((skill, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
            }}
          >
            <h3>{skill.name}</h3>
            <p style={{ opacity: 0.6 }}>Category: {skill.category}</p>

            <button
              onClick={() => handleStart(skill.name)}
              style={{
                marginTop: "12px",
                background: "#111",
                color: "white",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
              }}
            >
              Start Challenge
            </button>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION */}
      {selectedSkill && (
        <div
          ref={bottomRef}
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "#f9f9f9",
            borderRadius: "12px",
          }}
        >
          <h2>{selectedSkill} Challenge</h2>
<p>Duration: No limit</p>

<div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
  <button
    onClick={() => {
      const id = selectedSkill;

      router.push(
        `/dashboard/engineer/challenges/${id}?skill=${selectedSkill}`
      );
    }}
    style={{
      background: "#111",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
    }}
  >
    Begin Challenge
  </button>

  <button
    onClick={() => {
      setSelectedSkill(null);
    }}
    style={{
      background: "#ddd",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
    }}
  >
    Back
  </button>
</div>

    </div>
)}
</div>
);
}