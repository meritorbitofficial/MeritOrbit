"use client";

import { useRouter, usePathname } from "next/navigation";

export default function EngineerLayout({ children }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const navItem = (label: string, path: string) => (
    <div
      onClick={() => router.push(path)}
      style={{
        marginBottom: "15px",
        cursor: "pointer",
        color: pathname === path ? "#22c55e" : "#333",
        fontWeight: pathname === path ? "600" : "400",
        transition: "0.2s",
      }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <div style={sidebar}>
        <h1 style={logo} onClick={() => router.push("/")}>
          MeritOrbit
        </h1>

        <button
  style={subscription}
  onClick={() =>
    router.push(
      "/dashboard/engineer/subscription"
    )
  }
>
  Subscription
</button>

        {navItem("Profile", "/dashboard/engineer/profile")}
        {navItem("Projects", "/dashboard/engineer/projects")}
        {navItem("Verification", "/dashboard/engineer/verification")}
        {navItem("Challenges", "/dashboard/engineer/challenges")}
        {navItem("Opportunities", "/dashboard/engineer/opportunities")}
        {navItem("Settings", "/dashboard/engineer/settings")}
      </div>

      {/* MAIN CONTENT */}
      <div style={content}>
        {children}
      </div>
    </div>
  );
}

/* STYLES */

const sidebar = {
  width: "250px",
  padding: "30px",
  background: "#ffffff",
  borderRight: "1px solid #e5e7eb",
};

const logo = {
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "25px",
  cursor: "pointer",
};

const subscription = {
  width: "100%",
  padding: "12px",
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginBottom: "25px",
  cursor: "pointer",
};

const content = {
  flex: 1,
  padding: "40px",
  background: "#E6F7EF", // mint green theme
};