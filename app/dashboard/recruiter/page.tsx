"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function RecruiterDashboard() {

  const [loading, setLoading] = useState(true);

  const [recruiterData, setRecruiterData] = useState<any>(null);

  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(
      async (recruiter) => {

        if (!recruiter) {
          setLoading(false);
          return;
        }

        try {

          // recruiter document
          const recruiterRef = doc(
            db,
            "recruiters",
            recruiter.uid
          );

          const recruiterSnap = await getDoc(
            recruiterRef
          );

          if (recruiterSnap.exists()) {
            setRecruiterData(
              recruiterSnap.data()
            );
          }

          // saved engineers count
          const savedQuery = query(
            collection(db, "savedCandidates"),
            where(
              "recruiterId",
              "==",
              recruiter.uid
            )
          );

          const savedSnap = await getDocs(
            savedQuery
          );

          setSavedCount(savedSnap.size);

        } catch (error) {
          console.log(error);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-10 bg-[#dcefe8] min-h-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 bg-[#dcefe8] min-h-screen">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-gray-900">
          Recruiter Dashboard
        </h1>

        <p className="text-gray-700 mt-3 text-lg">
          Discover and hire verified engineers through MeritOrbit.
        </p>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <p className="text-gray-500 text-sm">
            Profiles Viewed
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {recruiterData?.profilesViewed || 0}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <p className="text-gray-500 text-sm">
            Saved Engineers
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {savedCount}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <p className="text-gray-500 text-sm">
            Active Plan
          </p>

          <h2 className="text-2xl font-bold mt-2 capitalize">
            {recruiterData?.subscriptionPlan || "Free"}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <p className="text-gray-500 text-sm">
            Remaining Unlocks
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {recruiterData?.remainingProfileUnlocks || 25}
          </h2>

        </div>

      </div>

      {/* PROFILE SECTION */}
      <div className="bg-white rounded-3xl p-8 shadow-md">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold text-gray-900">
              Recruiter Profile
            </h2>

            <p className="text-gray-600 mt-2">
              Complete your recruiter/company profile.
            </p>

          </div>

          <Link href="/dashboard/recruiter/profile">

            <button className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-80 transition">

              Open Profile

            </button>

          </Link>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-[#f5f7f6] rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Recruiter Name
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {recruiterData?.recruiterName || "Not Added"}
            </h3>

          </div>

          <div className="bg-[#f5f7f6] rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Company Name
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {recruiterData?.companyName || "Not Added"}
            </h3>

          </div>

          <div className="bg-[#f5f7f6] rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Company Type
            </p>

            <h3 className="text-2xl font-bold mt-2 capitalize">
              {recruiterData?.companyType || "Startup"}
            </h3>

          </div>

          <div className="bg-[#f5f7f6] rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Email
            </p>

            <h3 className="text-xl font-bold mt-2 break-all">
              {recruiterData?.email}
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}