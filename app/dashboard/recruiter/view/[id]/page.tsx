"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function VerifiedBadge({ type }: { type: "grey" | "blue" | "gold" }) {

  const colors = {
    grey: "#9ca3af",
    blue: "#1d9bf0",
    gold: "#facc15",
  };

  return (
    <span className="ml-2 inline-flex">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          fill={colors[type]}
          d="M12 2.5l2.2 1.5 2.7-.3 1.5 2.2 2.6.9.3 2.7 2.2 1.5-1.5 2.2.3 2.7-2.2 1.5-.9 2.6-2.7.3-1.5 2.2-2.2-1.5-2.7.3-1.5-2.2-2.6-.9-.3-2.7-2.2-1.5 1.5-2.2-.3-2.7 2.2-1.5.9-2.6 2.7-.3z"
        />
        <path
          fill="white"
          d="M10.2 14.6l-2.1-2.1-1.2 1.2 3.3 3.3 7-7-1.2-1.2z"
        />
      </svg>
    </span>
  );
}

export default function ViewEngineerProfile() {
  const [sending, setSending] = useState(false);
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [savedDocId, setSavedDocId] =
  useState("");
  const [loading, setLoading] = useState(true);

  const hasTracked = useRef(false);

  async function sendOpportunity() {

  try {

    const recruiter = auth.currentUser;

    if (!recruiter) {
      alert("Login required");
      return;
    }

    setSending(true);

    // recruiter data
    const recruiterRef = doc(
      db,
      "recruiters",
      recruiter.uid
    );

    const recruiterSnap = await getDoc(
      recruiterRef
    );

    const recruiterData = recruiterSnap.data();

    // create opportunity
    await addDoc(
      collection(db, "opportunities"),
      {
        recruiterId: recruiter.uid,
        engineerId: id,

        recruiterName:
          recruiterData?.recruiterName || "Recruiter",

        companyName:
          recruiterData?.companyName || "Company",

        recruiterEmail:
          recruiterData?.email || recruiter.email,

        engineerName:
          profile?.name || "Engineer",

        role:
          recruiterData?.hiringRole ||
          "Opportunity",

        status: "pending",

        createdAt: serverTimestamp(),
      }
    );

    alert("Opportunity sent");

  } catch (error) {
    console.log(error);
    alert("Failed to send opportunity");
  }

  setSending(false);
}

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      const ref = doc(db, "users", id as string);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();
      setProfile(data);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const recruiterId = currentUser.uid;
      // check if already saved
const savedQuery = query(
  collection(db, "savedCandidates"),
  where("recruiterId", "==", recruiterId),
  where("engineerId", "==", id as string)
);

const savedSnap = await getDocs(savedQuery);

if (!savedSnap.empty) {
  setSavedDocId(savedSnap.docs[0].id);
}
      const viewedBy = data.viewedBy || [];

      // ✅ Prevent double count
      if (!hasTracked.current && !viewedBy.includes(recruiterId)) {
        hasTracked.current = true;

        await updateDoc(ref, {
          recruiterViews: increment(1),
          viewedBy: [...viewedBy, recruiterId],
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

async function saveEngineer() {

  try {

    const recruiter = auth.currentUser;

    if (!recruiter) {
      alert("Please login");
      return;
    }

    // prevent duplicate saves
    const savedQuery = query(
      collection(db, "savedCandidates"),
      where("recruiterId", "==", recruiter.uid),
      where("engineerId", "==", id)
    );

    const savedSnap = await getDocs(savedQuery);

    if (!savedSnap.empty) {

      setSavedDocId(savedSnap.docs[0].id);

      alert("Already saved");

      return;
    }

    const newDoc = await addDoc(
      collection(db, "savedCandidates"),
      {
        recruiterId: recruiter.uid,
        engineerId: id as string,
        savedAt: Date.now(),
      }
    );

    setSavedDocId(newDoc.id);

    alert("Engineer saved");

  } catch (error) {

    console.log(error);

    alert("Failed to save engineer");

  }

}

async function unsaveEngineer() {

  try {

    if (!savedDocId) return;

    await deleteDoc(
      doc(db, "savedCandidates", savedDocId)
    );

    setSavedDocId("");

    alert("Engineer unsaved");

  } catch (error) {

    console.log(error);

    alert("Failed to unsave engineer");

  }

}

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dcefe8] px-6 py-10">

      <button
  onClick={() => history.back()}
  className="mb-6 bg-white border px-5 py-2 rounded-lg hover:bg-gray-100"
>
  ← Back
</button>

      {/* MAIN CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-white/40">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">

          <div>
            <div className="flex items-center">
  <h1 className="text-3xl font-bold">
    {profile.name}
  </h1>

  {profile.badge && (
    <VerifiedBadge type={profile.badge} />
  )}
</div>

            <p className="text-gray-600 mt-1">
<p className="mt-2 text-green-700 font-semibold">
  Merit Score: {profile.meritScore || 0}
</p>

              {profile.professionalRole || "No role added"}
            </p>
<div className="flex gap-3 mt-5">

 <button
  onClick={sendOpportunity}
  disabled={sending}
  className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-80"
>
  {sending ? "Sending..." : "Send Opportunity"}
</button>

 {savedDocId ? (

  <button
    onClick={unsaveEngineer}
    className="border border-red-300 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50"
  >
    Unsave Engineer
  </button>

) : (

 <button
  onClick={saveEngineer}
  className="border px-5 py-2 rounded-lg hover:bg-gray-100"
>
  Save Engineer
</button>

)}

</div>

          </div>

          
        </div>

        {/* DIVIDER */}
        <div className="border-t my-6" />

{/* QUALIFICATION */}
<div className="mb-6">
  <h2 className="font-semibold mb-2">
    Qualification
  </h2>

  <p className="text-gray-700">
    {profile.qualification || "No qualification added"}
  </p>
</div>

        {/* SKILLS */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Skills</h2>

          <div className="flex flex-wrap gap-2">
            {profile.skills ? (
              profile.skills.split(",").map((skill: string, i: number) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill.trim()}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added</p>
            )}
          </div>
        </div>

        {/* BIO */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Bio</h2>

          <p className="text-gray-700">
            {profile.bio || "No bio added"}
          </p>
        </div>

{/* EXPERIENCE */}
<div className="mb-6">
  <h2 className="font-semibold mb-2">
    Experience
  </h2>

  <p className="text-gray-700 whitespace-pre-line">
    {profile.experience || "No experience added"}
  </p>
</div>

        {/* PROJECTS */}
        <div>
          <h2 className="font-semibold mb-3">Projects</h2>

          {Array.isArray(profile.projects) &&
          profile.projects.length > 0 ? (
            profile.projects.map((project: any, i: number) => (
              <div
                key={i}
                className="border p-4 rounded-lg mb-4 hover:shadow-sm transition"
              >
                <p className="font-semibold">{project.title}</p>

                <p className="text-sm text-gray-600 mt-1">
                  {project.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects</p>
          )}
        </div>
      </div>
    </div>
  );
}