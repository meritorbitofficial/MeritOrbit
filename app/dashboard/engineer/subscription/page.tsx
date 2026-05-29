"use client";

import Script from "next/script";
import { auth, db } from "@/lib/firebase";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

export default function SubscriptionPage() {
  return (
    <>
      <Script
  id="razorpay-script"
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"
/>
    
    <div>

      <h1 style={{ fontSize: "34px", marginBottom: "30px" }}>
        Subscription Plans
      </h1>

      {/* Plans Container */}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        {/* Base Verified */}

        <div style={card}>
          <h2>Base Verified</h2>

          <p style={price}>₹999</p>

          <p>• Grey verification badge</p>
          <p>• Required to appear on recruiter's search list</p>
          <p>• Verified engineer profile</p>
          <p>• Badge for lifetime</p>

        <button
  onClick={() =>
  openRazorpay(
    999,
    "grey",
    120
  )
}
  style={button}
>
  Activate
</button>
        </div>


        {/* Pro Visibility */}

        <div style={card}>
          <h2>Pro Visibility</h2>

          <p style={price}>₹1299 / month</p>

          <p>• Sky blue verification badge</p>
          <p>• Higher ranking in recruiter search</p>
          <p>• More recruiter profile views</p>

         <button
  onClick={() =>
  openRazorpay(
    1299,
    "blue",
    1
  )
}
  style={button}
>
  Upgrade to Pro
</button>
        </div>


        {/* Elite Engineer */}

        <div style={card}>
          <h2>Elite Engineer</h2>

          <p style={price}>₹1699 / month</p>

          <p>• Gold verification badge</p>
          <p>• Top placement in recruiter search</p>
          <p>• Maximum recruiter visibility</p>

         <button
  onClick={() =>
  openRazorpay(
    1699,
    "gold",
    1
  )
}
  style={button}
>
  Upgrade to Elite
</button>
        </div>

      </div>

    </div>
    </>
  );
}

async function openRazorpay(
  amount: number,
  plan: string,
  months: number
) {

  alert("TEST VERSION 123");

  console.log("Creating order...");
  
  const response = await fetch(
    "/api/razorpay/create-order",
    {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100,
      }),
    }
  );

  const order = await response.json();
alert(JSON.stringify(order));
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

    amount: order.amount,

    currency: order.currency,

    order_id: order.id,

    name: "MeritOrbit",

    description: plan,

    handler: async function () {
      await activatePlan(
        plan,
        months
      );

      alert("Payment successful");
    },
  };

alert(typeof (window as any).Razorpay);

  const razorpay =
    new (window as any).Razorpay(
      options
    );

    if (!(window as any).Razorpay) {
  alert("Razorpay script not loaded");
  return;
}

  razorpay.open();
}

async function activatePlan(
  type: string,
  months: number
) {

  try {

    const user = auth.currentUser;

    if (!user) {
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
      doc(db, "users", user.uid),
      {
        subscription: type,

        subscriptionExpiresAt:
          expiry,
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

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "14px",
  width: "260px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
}

const price = {
  fontSize: "26px",
  fontWeight: "700",
  margin: "10px 0 20px"
}

const button = {
  marginTop: "15px",
  padding: "10px 14px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
}

const disabledButton = {
  marginTop: "15px",
  padding: "10px 14px",
  background: "#e5e7eb",
  color: "#555",
  border: "none",
  borderRadius: "8px"
}