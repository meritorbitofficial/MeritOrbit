"use client";

import { useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [email, setEmail] = useState("");

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

  // ✅ RESET FUNCTION
  const handleReset = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link sent to your email");
    } catch (error: any) {
      alert(error.message);
    }
  };

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
          {/* ✅ FIX: canvas should not block clicks */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.06,
              pointerEvents: "none",
            }}
          />

          <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
              Reset Your Password
            </h1>
            <p>Secure access to your MeritLayer account</p>
          </div>

          <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Account Recovery
            </h3>
            <p>
              Enter your registered email and we will send a secure password
              reset link to restore access to your account.
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
            Forgot your password?
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
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

          <button
            onClick={handleReset} // ✅ WORKING BUTTON
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
            Send Reset Link
          </button>

          <p style={{ textAlign: "center" }}>
            Remember your password?{" "}
            <a href="/login" style={{ color: "#22c55e" }}>
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}