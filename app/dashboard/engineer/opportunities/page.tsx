"use client";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type Opportunity = {
  id: string;

  companyName: string;

  recruiterName: string;

  recruiterEmail: string;

  role: string;

  status: string;
};

export default function OpportunitiesPage() {

  const [requests, setRequests] =
    useState<Opportunity[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchOpportunities() {

      try {

        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "opportunities"),
          where(
            "engineerId",
            "==",
            user.uid
          )
        );

        const snapshot = await getDocs(q);

        const data: Opportunity[] = [];

        snapshot.forEach((docSnap) => {

          data.push({
            id: docSnap.id,
            ...(docSnap.data() as any),
          });

        });

        setRequests(data);

      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    fetchOpportunities();

  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {

    try {

      await updateDoc(
        doc(db, "opportunities", id),
        {
          status,
        }
      );

      setRequests((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      );

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={container}>

      <h1 style={title}>
        Opportunities
      </h1>

      {loading && (
        <p>Loading...</p>
      )}

      {!loading &&
        requests.length === 0 && (
          <div style={emptyBox}>
            <h3>No Opportunities Yet</h3>

            <p style={{ marginTop: "10px" }}>
              Recruiters will send you
              opportunities here.
            </p>
          </div>
        )}

      {requests.map((job) => (

        <div key={job.id} style={card}>

          <h3>{job.role}</h3>

          <p>
            <b>{job.companyName}</b>
          </p>

          <p>
            Recruiter:
            {" "}
            {job.recruiterName}
          </p>

          <p>
            Contact:
            {" "}
            {job.recruiterEmail}
          </p>

          <p
            style={{
              marginTop: "10px",
            }}
          >
            Status:
            {" "}
            <b>{job.status}</b>
          </p>

          {job.status === "pending" && (

            <div style={btnRow}>

              <button
                onClick={() =>
                  updateStatus(
                    job.id,
                    "accepted"
                  )
                }
                style={acceptBtn}
              >
                Accept
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    job.id,
                    "declined"
                  )
                }
                style={declineBtn}
              >
                Decline
              </button>

            </div>

          )}

        </div>

      ))}

    </div>
  );
}

/* STYLES */

const container = {
  padding: "40px",
};

const title = {
  fontSize: "36px",
  marginBottom: "20px",
};

const emptyBox = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  maxWidth: "700px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  maxWidth: "700px",
};

const btnRow = {
  marginTop: "12px",
  display: "flex",
  gap: "10px",
};

const acceptBtn = {
  padding: "10px 16px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const declineBtn = {
  padding: "10px 16px",
  background: "#eee",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};