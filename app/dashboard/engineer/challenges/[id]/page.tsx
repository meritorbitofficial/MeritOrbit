"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { db, auth } from "@/lib/firebase";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

type MCQ = {
  question: string;
  options: string[];
  answer: string;
};

type FillBlank = {
  question: string;
  answer: string;
};

type Coding = {
  question: string;
  answer: string;
};

type Debugging = {
  question: string;
  buggyCode: string;
  answer: string;
};

type TrueFalse = {
  question: string;
  answer: boolean;
};

export default function ChallengeDetailsPage() {
  const params = useParams();

  const skill =
    typeof params.id === "string"
      ? decodeURIComponent(params.id)
      : "";

  const [loading, setLoading] =
    useState(true);

  const [questions, setQuestions] =
    useState<any>({
      mcqs: [],
      fillBlanks: [],
      coding: [],
      trueFalse: [],
      debugging: [],
    });

  const [answers, setAnswers] =
    useState<any>({});

  const [score, setScore] =
    useState<number | null>(null);

  const [currentQuestion,
    setCurrentQuestion] =
    useState(0);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const ref = doc(
          db,
          "challengeQuestions",
          skill.toLowerCase()
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {
          setQuestions(
            snap.data().data
          );
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    }

    if (skill) {
      loadQuestions();
    }
  }, [skill]);

  async function handleSubmit() {
    let finalScore = 0;

    questions.mcqs?.forEach(
      (q: MCQ, index: number) => {
        if (
          answers[`mcq-${index}`] ===
          q.answer
        ) {
          finalScore += 2;
        }
      }
    );

    setScore(finalScore);

    const user = auth.currentUser;

    if (!user) return;

    await setDoc(
      doc(
        db,
        "challengeResults",
        `${user.uid}-${skill}`
      ),
      {
        userId: user.uid,
        skill: skill,
        score: finalScore,
        submittedAt: Date.now(),
      }
    );

    await setDoc(
      doc(db, "users", user.uid),
      {
        challengeScore: finalScore,
      },
      { merge: true }
    );
  }

  const allQuestions = [
    ...(questions.mcqs || []).map(
      (q: any) => ({
        ...q,
        type: "mcq",
      })
    ),
  ];

  const q =
    allQuestions[currentQuestion];

  if (loading) {
    return (
      <div
        style={{
          padding: "24px",
        }}
      >
        Loading...
      </div>
    );
  }
return (
  <div
    style={{
      minHeight: "100vh",
      background: "#eef5f0",
      padding: "24px",
    }}
  >
    <h1
      style={{
        fontSize: "28px",
        fontWeight: "700",
        color: "black",
        marginBottom: "18px",
      }}
    >
      {skill} Challenge
    </h1>

    <div
      style={{
        background: "white",
        borderRadius: "24px",
        padding: "18px",
        display: "grid",
        gridTemplateColumns: "1fr 320px",
gap: "24px",
alignItems: "start",
maxWidth: "1180px",
margin: "0 auto",
      }}
    >
      {/* LEFT SIDE */}
      <div>
        <h2
          style={{
            fontSize: "24px",
            color: "#111827",
            marginBottom: "22px",
            fontWeight: "700",
          }}
        >
          {currentQuestion + 1}. {q?.question}
        </h2>

        <div
  style={{
    borderRadius: "22px",
    padding: "16px",
    minHeight: "auto",
    maxWidth: "100%",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.10)",
    border: "1px solid #e5e7eb",
  }}
>
          {q?.code
            ?.split("\n")
            .map(
              (
                line: string,
                index: number
              ) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    fontFamily:
                      "'Fira Code', monospace",
                    fontSize: "15px",
                    lineHeight: "1.7",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      color: "#111827",
                      flexShrink: 0,
                      userSelect: "none",
                    }}
                  >
                    {index + 1}
                  </div>

                  <div
  style={{
    color: "#111827",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontWeight: "600",
  }}
>
                    {line}
                  </div>
                </div>
              )
            )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <h2
          style={{
            fontSize: "22px",
            color: "#111827",
            marginBottom: "26px",
            fontWeight: "700",
          }}
        >
          Select Answer
        </h2>

        {q?.options?.map(
          (
            option: string,
            i: number
          ) => (
            <button
              key={i}
              onClick={() =>
                setAnswers(
                  (prev: any) => ({
                    ...prev,
                    [`mcq-${currentQuestion}`]:
                      option,
                  })
                )
              }
              style={{
                width: "100%",
                textAlign: "left",
                padding: "16px",
                marginBottom: "14px",
                borderRadius: "18px",
                border:
                  answers[
                    `mcq-${currentQuestion}`
                  ] === option
                    ? "3px solid #111827"
                    : "1px solid #e5e7eb",

                background:
  answers[
    `mcq-${currentQuestion}`
  ] === option
    ? "#111827"
    : "#f8fafc",

                color: 
                answers[
    `mcq-${currentQuestion}`
  ] === option
    ? "white"
    : "#111827",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "0.2s",
              }}
            >
              {option}
            </button>
          )
        )}

        <div
          style={{
            display: "flex",
            gap: "18px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={() =>
              setCurrentQuestion(
                currentQuestion - 1
              )
            }
            disabled={
              currentQuestion === 0
            }
            style={{
              background: "#111827",
              color: "white",
              padding: "16px 30px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Previous
          </button>

          {currentQuestion <
          allQuestions.length - 1 ? (
            <button
              onClick={() =>
                setCurrentQuestion(
                  currentQuestion + 1
                )
              }
              style={{
                background: "#111827",
                color: "white",
                padding: "16px 34px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                background: "#111827",
                color: "white",
                padding: "16px 34px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>

    {score !== null && (
      <div
        style={{
          marginTop: "30px",
          background: "#111827",
          padding: "20px",
          borderRadius: "20px",
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          Your Score: {score}
        </h2>
      </div>
    )}
  </div>
);
}