"use client";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { useRouter } from "next/navigation";

export default function SavedEngineersPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [engineers, setEngineers] = useState<any[]>([]);

async function unsaveEngineer(savedDocId: string) {

  try {

    await deleteDoc(
      doc(db, "savedCandidates", savedDocId)
    );

    setEngineers((prev) =>
      prev.filter(
        (eng) => eng.savedDocId !== savedDocId
      )
    );

    alert("Engineer removed");

  } catch (error) {

    console.log(error);

    alert("Failed to unsave engineer");

  }

}

  useEffect(() => {

    async function fetchSavedEngineers() {

      try {

        const recruiter = auth.currentUser;

        if (!recruiter) {
          setLoading(false);
          return;
        }

        // get saved candidates
        const savedQuery = query(
          collection(db, "savedCandidates"),
          where("recruiterId", "==", recruiter.uid)
        );

        const savedSnap = await getDocs(savedQuery);

        const savedData = [];

        for (const savedDoc of savedSnap.docs) {

          const data = savedDoc.data();

          const engineerRef = doc(
            db,
            "users",
            data.engineerId
          );

          const engineerSnap = await getDoc(
            engineerRef
          );

          if (engineerSnap.exists()) {

           savedData.push({
  id: engineerSnap.id,
  savedDocId: savedDoc.id,
  ...engineerSnap.data(),
});

          }

        }

        setEngineers(savedData);

      } catch (error) {
        console.log(error);
      }

      setLoading(false);

    }

    fetchSavedEngineers();

  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-10 bg-[#dcefe8] min-h-screen">
        Loading saved engineers...
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 bg-[#dcefe8] min-h-screen">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-gray-900">
          Saved Engineers
        </h1>

        <p className="text-gray-700 mt-3 text-lg">
          Engineers you shortlisted.
        </p>

      </div>

      {/* EMPTY */}
      {engineers.length === 0 && (

        <div className="bg-white rounded-3xl p-10 shadow-sm">

          <p className="text-gray-600 text-lg">
            No saved engineers yet.
          </p>

        </div>

      )}

      {/* ENGINEERS */}
      <div className="space-y-6">

        {engineers.map((eng, i) => (

          <div
            key={i}
            className="bg-white rounded-3xl p-6 shadow-sm flex items-center justify-between"
          >

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                {eng.name || "Unnamed Engineer"}
              </h2>

              <p className="text-gray-600 mt-1">
                {eng.professionalRole || "Software Engineer"}
              </p>

              <p className="mt-3 text-green-700 font-semibold">
                Merit Score: {eng.meritScore || 0}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                {typeof eng.skills === "string" &&
                  eng.skills
                    .split(",")
                    .map((skill: string, index: number) => (

                      <span
                        key={index}
                        className="bg-[#dcefe8] text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>

                    ))}

              </div>

            </div>

           <div className="flex flex-col gap-3">

  <button
    onClick={() =>
      router.push(
        `/dashboard/recruiter/view/${eng.id}`
      )
    }
    className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-80"
  >
    View Profile
  </button>

  <button
    onClick={() =>
      unsaveEngineer(eng.savedDocId)
    }
    className="border border-red-300 text-red-600 px-6 py-3 rounded-xl hover:bg-red-50"
  >
    Unsave
  </button>

</div>

          </div>

        ))}

      </div>

    </div>
  );
}