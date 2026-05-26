"use client";

import { useRouter } from "next/navigation";

export default function RecruiterPage() {
  const router = useRouter();

  function handleStartHiring() {
  router.push("/login");
}

  function handleHowItWorks() {
    // 👉 scroll to features section
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#dcefe8]">

      <div className="max-w-6xl mx-auto px-10 py-16">

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-tight text-gray-900">
            Hire Proven Engineers with Confidence
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            MeritOrbit evaluates engineers through real coding challenges,
            project validation, and measurable performance — helping you hire
            based on actual ability.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleStartHiring}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-green-700 transition"
            >
              Start Hiring
            </button>

            <button
              onClick={handleHowItWorks}
              className="bg-white px-6 py-3 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
            >
              How It Works
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div
          id="features"
          className="grid md:grid-cols-3 gap-8 mt-20"
        >

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Verified Skill Assessment
            </h3>
            <p className="text-gray-600">
              Engineers are evaluated through structured coding challenges to
              ensure real technical capability.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Project-Based Validation
            </h3>
            <p className="text-gray-600">
              Every profile includes real projects, enabling direct evaluation
              of implementation quality.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Merit Score System
            </h3>
            <p className="text-gray-600">
              A unified score reflects consistency, depth of knowledge, and
              verified performance.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}