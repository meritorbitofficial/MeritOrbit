"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // ✅ LOAD USER DATA
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setEmail(user.email || "");

      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setRole(data.role || "Engineer");
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  // ✅ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Delete your account permanently?");
    if (!confirmDelete) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      alert("Account deleted");
      window.location.href = "/signup";
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        alert("Please login again before deleting account");
      } else {
        alert("Error deleting account");
      }
    }
  };

  // ✅ CHANGE PASSWORD (REAL WORKING)
  const handleChangePassword = async () => {
    if (!email) {
      alert("User email not found");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email");
    } catch (error) {
      console.error(error);
      alert("Error sending reset email");
    }
  };

  return (
    <main
      style={{
        fontFamily: "Calisto MT, serif",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "30px" }}>
        Settings
      </h1>

      {/* ACCOUNT INFO */}
      <div style={card}>
        <h3>Account Information</h3>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Account Type:</strong> {role}
        </p>
      </div>

      {/* SECURITY */}
      <div style={card}>
        <h3>Security</h3>
        <button style={darkBtn} onClick={handleChangePassword}>
          Change Password
        </button>
      </div>

      {/* ACTIONS */}
      <div style={card}>
        <h3>Account Actions</h3>

        <div style={{ display: "flex", gap: "15px" }}>
          <button style={lightBtn} onClick={handleLogout}>
            Logout
          </button>

          <button style={deleteBtn} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </main>
  );
}

/* STYLES */

const card = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const darkBtn = {
  background: "#111",
  color: "white",
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const lightBtn = {
  background: "#eee",
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};