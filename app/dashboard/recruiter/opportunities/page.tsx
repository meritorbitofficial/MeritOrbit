"use client";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type Opportunity = {
  id: string;

  role: string;

  status: string;

  recruiterName: string;

  recruiterEmail: string;

  companyName: string;

  engineerId: string;

  engineer?: any;
};

export default function SentOpportunities() {

  const [data, setData] =
    useState<Opportunity[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchData() {

      try {

        const recruiter =
          auth.currentUser;

        if (!recruiter) {
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "opportunities"),
          where(
            "recruiterId",
            "==",
            recruiter.uid
          )
        );

        const snapshot =
          await getDocs(q);

        const temp: Opportunity[] = [];

        for (const item of snapshot.docs) {

          const oppData =
            item.data() as any;

          let engineerData = null;

          try {

            const engineerRef = doc(
              db,
              "users",
              oppData.engineerId
            );

            const engineerSnap =
              await getDoc(engineerRef);

            if (engineerSnap.exists()) {
              engineerData =
                engineerSnap.data();
            }

          } catch (error) {
            console.log(error);
          }

          temp.push({
            id: item.id,
            ...oppData,
            engineer: engineerData,
          });

        }

        setData(temp);

      } catch (error) {
        console.log(error);
      }

      setLoading(false);

    }

    fetchData();

  }, []);

  return (

    <div style={container}>

      <h1 style={title}>
        Sent Opportunities
      </h1>

      {loading && (
        <p>Loading...</p>
      )}

      {!loading &&
        data.length === 0 && (
          <div style={emptyBox}>
            No opportunities sent yet.
          </div>
        )}

      {data.map((item) => (

        <div
          key={item.id}
          style={card}
        >

          <h2 style={roleStyle}>
            {item.role}
          </h2>

          <p>
            Company:
            {" "}
            <b>{item.companyName}</b>
          </p>

          <p style={{ marginTop: "10px" }}>
            Status:
            {" "}

            <b>
              {item.status}
            </b>
          </p>

          <hr style={divider} />

          {item.engineer && (

            <div>

              <h3 style={sectionTitle}>
                Engineer Details
              </h3>

              <p>
                <b>Name:</b>
                {" "}
                {item.engineer.name}
              </p>

              <p>
                <b>Email:</b>
                {" "}
                {item.engineer.email}
              </p>

              <p>
                <b>Qualification:</b>
                {" "}
                {item.engineer.qualification}
              </p>

              <p>
                <b>Skills:</b>
                {" "}
                {item.engineer.skills}
              </p>

              <p>
                <b>Experience:</b>
                {" "}
                {item.engineer.experience}
              </p>

              <p>
                <b>Bio:</b>
                {" "}
                {item.engineer.bio}
              </p>

              {Array.isArray(
                item.engineer.projects
              ) &&
                item.engineer.projects.length > 0 && (

                <div
                  style={{
                    marginTop: "15px",
                  }}
                >

                  <p>
                    <b>Projects:</b>
                  </p>

                  {item.engineer.projects.map(
                    (
                      project: any,
                      i: number
                    ) => (

                      <div
                        key={i}
                        style={projectCard}
                      >

                        <p>
                          <b>
                            {project.title}
                          </b>
                        </p>

                        <p>
                          {
                            project.description
                          }
                        </p>

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                          >
                            View Project
                          </a>
                        )}

                      </div>

                    )
                  )}

                </div>

              )}

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
  marginBottom: "30px",
};

const emptyBox = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
};

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  marginBottom: "25px",
  maxWidth: "900px",
};

const roleStyle = {
  fontSize: "24px",
  marginBottom: "10px",
};

const divider = {
  marginTop: "20px",
  marginBottom: "20px",
};

const sectionTitle = {
  fontSize: "18px",
  marginBottom: "10px",
};

const projectCard = {
  border: "1px solid #ddd",
  padding: "12px",
  borderRadius: "10px",
  marginTop: "10px",
};