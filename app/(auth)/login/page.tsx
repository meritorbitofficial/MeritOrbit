"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Login() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  async function handleLogin() {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

     // CHECK RECRUITER FIRST
const recruiterRef = doc(
  db,
  "recruiters",
  user.uid
);

const recruiterSnap = await getDoc(
  recruiterRef
);

if (recruiterSnap.exists()) {

  router.push("/dashboard/recruiter");

  return;
}

// CHECK ENGINEER
const engineerRef = doc(
  db,
  "users",
  user.uid
);

const engineerSnap = await getDoc(
  engineerRef
);

if (engineerSnap.exists()) {

  const engineerData =
    engineerSnap.data();

  if (
    engineerData?.role === "engineer"
  ) {

    router.push(
      "/dashboard/engineer/profile"
    );

    return;
  }
}


alert("Account not found");
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

          <div style={{ textAlign: "center", zIndex: 2 }}>
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
              Welcome Back to MeritOrbit
            </h1>

            <h2 style={{ fontSize: "20px", color: "#333" }}>
              Access your account
            </h2>
          </div>

          <div style={{ textAlign: "center", zIndex: 2 }}>
            <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Your Merit Network Awaits
            </h3>

            <p style={{ color: "#555", maxWidth: "420px", margin: "0 auto" }}>
              Continue building your credibility and connect with real
              engineering opportunities.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "60px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "30px" }}>
            Login to your account
          </h2>

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
          <div style={{ marginBottom: "10px", position: "relative" }}>
            <label>Password</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 45px 12px 12px",
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
                fontSize: "18px",
                userSelect: "none",
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* FORGOT PASSWORD */}
          <div style={{ textAlign: "right", marginBottom: "25px" }}>
            <a href="/forgot-password" style={{ color: "#22c55e" }}>
              Forgot password?
            </a>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
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
            Login
          </button>

          <p style={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <a href="/signup" style={{ color: "#22c55e" }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}