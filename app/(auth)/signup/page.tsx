"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Signup() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  // 🔥 STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("engineer");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: { x: number; y: number }[] = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      });
    }

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 1;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
    }
  }, []);

  // 🔥 SIGNUP FUNCTION
  async function handleSignup() {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // 🔥 save user in firestore
      if (role === "engineer") {

  await setDoc(doc(db, "users", user.uid), {
    email,
    role: "engineer",

    name: "",
    qualification: "",
    skills: "",
    bio: "",
    experience: "",
    projects: [],

    meritScore: 0,
    recruiterViews: 0,
    challengeScore: 0,

    isVerified: false,
    githubLinked: false,

    subscription: "free",
    subscriptionExpiresAt: 0,

    badge: null,

    viewedBy: [],
  });

} else {

  await setDoc(doc(db, "recruiters", user.uid), {
    recruiterName: "",
    companyName: "",

    email,

    role: "recruiter",

    companyType: "startup",

    subscriptionPlan: "free",

    profilesViewed: 0,

    remainingProfileUnlocks: 25,

    contactAccess: false,

    savedCandidates: [],

    createdAt: Date.now(),
  });

}

      // 🔥 redirect
      if (role === "engineer") {
  router.push("/dashboard/engineer/profile");
} else {
  router.push("/dashboard/recruiter");
}

    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#E6F7EF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "Calisto MT, serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "1100px",
          gap: "40px",
        }}
      >
        {/* LEFT CARD */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "60px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            height: "520px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* NETWORK BG */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.06,
            }}
          />

          {/* TOP TEXT */}
          <div style={{ textAlign: "center", zIndex: 2 }}>
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
              Welcome to MeritOrbit
            </h1>

            <h2 style={{ fontSize: "22px", color: "#333" }}>
              Where Talent Meets Opportunity
            </h2>
          </div>

          {/* BOTTOM TEXT */}
          <div style={{ textAlign: "center", zIndex: 2 }}>
            <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Skill-Based Hiring
            </h3>

            <p style={{ color: "#555", maxWidth: "420px", margin: "0 auto" }}>
              Connecting verified engineers with recruiters who value real
              technical ability.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "60px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "30px" }}>
            Create Account
          </h2>

          {/* ROLE */}
          <div style={{ marginBottom: "20px" }}>
            <label>Role</label>

            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              <button
                onClick={() => setRole("engineer")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: role === "engineer" ? "#22c55e" : "#f8f8f8",
                  color: role === "engineer" ? "white" : "black",
                  cursor: "pointer",
                }}
              >
                Engineer
              </button>

              <button
                onClick={() => setRole("recruiter")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: role === "recruiter" ? "#22c55e" : "#f8f8f8",
                  color: role === "recruiter" ? "white" : "black",
                  cursor: "pointer",
                }}
              >
                Recruiter
              </button>
            </div>
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* PASSWORD WITH EYE */}
          <div style={{ marginBottom: "30px", position: "relative" }}>
            <label>Password</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "42px",
                cursor: "pointer",
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSignup}
            style={{
              width: "100%",
              padding: "14px",
              background: "#22c55e",
              color: "white",
              borderRadius: "10px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Create Account
          </button>

          <p style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#22c55e" }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}