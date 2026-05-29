"use client";

import Script from "next/script";

import { auth, db } from "@/lib/firebase";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

export default function SubscriptionPage() {

  async function activatePlan(
    type: string,
    months: number,
    unlocks: number
  ) {

    try {

      const recruiter =
        auth.currentUser;

      if (!recruiter) {
        alert("Login required");
        return;
      }

      const now = Date.now();

      const expiry =
        now +
        months *
          30 *
          24 *
          60 *
          60 *
          1000;

      await updateDoc(
        doc(
          db,
          "recruiters",
          recruiter.uid
        ),
        {
          subscriptionPlan: type,

          subscriptionStart: now,

          subscriptionExpiresAt:
            expiry,

          remainingProfileUnlocks:
            unlocks,
        }
      );

      alert(
        `${type.toUpperCase()} activated`
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to activate subscription"
      );

    }

  }

async function openRazorpay(
  amount: number,
  plan: string,
  months: number,
  unlocks: number
) {

  const options = {
    key:
      process.env
        .NEXT_PUBLIC_RAZORPAY_KEY_ID,

    amount: amount * 100,

    currency: "INR",

    name: "MeritOrbit",

    description: plan,

    handler: async function () {

      await activatePlan(
        plan,
        months,
        unlocks
      );

      alert(
        "Payment successful"
      );
    },
  };

  const razorpay =
    new (window as any).Razorpay(
      options
    );

  razorpay.open();
}

 return (
<>
<Script src="https://checkout.razorpay.com/v1/checkout.js" />
  <div
    style={{
      paddingLeft: "40px",
      paddingTop: "10px",
    }}
  >

      <h1 style={{ fontSize: "34px", marginBottom: "30px" }}>
        Subscription Plans
      </h1>

      {/* Plans Container */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        {/* STARTUP */}

        <div style={card}>

          <h2>Startup</h2>

          <p style={price}>
            ₹5999 / month
          </p>

          <p>
            • 150 profile unlocks
          </p>

          <p>
            • Verified engineers access
          </p>

          <p>
            • Opportunity management
          </p>

          <button
            onClick={() =>
             openRazorpay(
  5999,
  "startup",
  1,
  150
)
            }
            style={button}
          >
            Activate Plan
          </button>

        </div>

        {/* AGENCY */}

        <div style={card}>

          <h2>Agency</h2>

          <p style={price}>
            ₹14999 / month
          </p>

          <p>
            • 500 profile unlocks
          </p>

          <p>
            • Multi hiring support
          </p>

          <p>
            • Priority recruiter access
          </p>

          <button
            onClick={() =>
             openRazorpay(
  14999,
  "agency",
  1,
  500
)
            }
            style={button}
          >
            Activate Plan
          </button>

        </div>

        {/* ENTERPRISE */}

        <div style={card}>

          <h2>Enterprise</h2>

          <p style={price}>
            ₹26999 / month
          </p>

          <p>
            • Unlimited unlocks
          </p>

          <p>
            • Maximum recruiter power
          </p>

          <p>
            • Enterprise hiring tools
          </p>

          <button
            onClick={() =>
             openRazorpay(
  26999,
  "enterprise",
  1,
  999999
)
            }
            style={button}
          >
            Activate Plan
          </button>

        </div>

      </div>

    </div>
    </>
  );
}


const card = {
  background: "white",
  padding: "30px",
  borderRadius: "14px",
  width: "260px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.05)",
};

const price = {
  fontSize: "24px",
  fontWeight: "700",
  margin: "10px 0 20px",
};

const button = {
  marginTop: "15px",
  padding: "10px 14px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};