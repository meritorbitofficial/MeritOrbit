"use client";

import { useRouter } from "next/navigation";
import { 
  collection, 
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db,auth } from 
"@/lib/firebase";
import { useState,useEffect } from "react";

/* VERIFIED BADGE */
function VerifiedBadge({ type }: { type: "grey" | "blue" | "gold" }) {
  const colors = {
    grey: "#9ca3af",
    blue: "#1d9bf0",
    gold: "#facc15",
  };

  return (
    <span className="ml-2 inline-flex">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill={colors[type]} d="M12 2.5l2.2 1.5 2.7-.3 1.5 2.2 2.6.9.3 2.7 2.2 1.5-1.5 2.2.3 2.7-2.2 1.5-.9 2.6-2.7.3-1.5 2.2-2.2-1.5-2.7.3-1.5-2.2-2.6-.9-.3-2.7-2.2-1.5 1.5-2.2-.3-2.7 2.2-1.5.9-2.6 2.7-.3z"/>
        <path fill="white" d="M10.2 14.6l-2.1-2.1-1.2 1.2 3.3 3.3 7-7-1.2-1.2z"/>
      </svg>
    </span>
  );
}

/* FULL SKILLS */
const ALL_SKILLS = [
  "React","Next.js","Angular","Vue.js","HTML","CSS","JavaScript","TypeScript",
  "Node.js","Express.js","Django","Flask","Spring Boot",
  "MongoDB","PostgreSQL","MySQL","Firebase","Redis",
  "Docker","Kubernetes","AWS","Google Cloud",
  "Python","Java","C++","Go","Rust",
  "Machine Learning","Deep Learning","TensorFlow","PyTorch","NLP","Computer Vision",
  "LLMs","LangChain","OpenAI API","Data Science",
  "Git","REST APIs","GraphQL"
];

export default function SearchPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
const [experience, setExperience] = useState("");
const [verification, setVerification] = useState("");
const [minimumScore, setMinimumScore] = useState("");
  const [engineers, setEngineers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchEngineers() {

    const snap = await getDocs(collection(db, "users"));

    const data = snap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((user: any) => user.role === "engineer");

    setEngineers(data);

    setLoading(false);
  }

  fetchEngineers();
}, []);

async function saveEngineer(engineerId: string) {
  try {

    const recruiter = auth.currentUser;

    if (!recruiter) {
      alert("Please login");
      return;
    }

    // prevent duplicates
    const q = query(
      collection(db, "savedCandidates"),
      where("recruiterId", "==", recruiter.uid),
      where("engineerId", "==", engineerId)
    );

    const existing = await getDocs(q);

    if (!existing.empty) {
      alert("Already saved");
      return;
    }

    await addDoc(collection(db, "savedCandidates"), {
      recruiterId: recruiter.uid,
      engineerId,
      savedAt: Date.now(),
    });

    alert("Engineer saved");

  } catch (error) {
    console.log(error);
    alert("Failed to save engineer");
  }
}

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  }

  /* FILTER */
  const filtered = engineers
  .filter((eng) =>
    (eng.name || "")
  .toLowerCase()
  .includes(searchQuery.toLowerCase())
  )

  .filter((eng) =>
    selectedSkills.length === 0
      ? true
      : selectedSkills.every((s) =>
  (eng.skills || "").includes(s)
)
  )

  .filter((eng) =>
    experience === ""
      ? true
      : eng.experience === experience
  )

  .filter((eng) =>
    verification === ""
      ? true
      : eng.verification === verification
  )

  .filter((eng) =>
    minimumScore === ""
      ? true
      : (eng.meritScore || 0) >= Number(minimumScore)
  )

  .sort(
  (a, b) =>
    (b.meritScore || 0) -
    (a.meritScore || 0)
); // 🔥 sorting by merit

  return (
    <div className="min-h-screen bg-[#dcefe8]">
      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-gray-900">
          Discover Engineers
        </h1>

        <p className="text-gray-600 mt-2">
          Hire verified engineers based on real performance.
        </p>

        {/* SEARCH */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search engineers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* FILTER */}
        <div className="mt-6 bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">Filter by Skills</h3>

          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedSkills.includes(skill)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

{/* ADVANCED FILTERS */}
<div className="mt-6 grid md:grid-cols-3 gap-4">

  {/* EXPERIENCE */}
  <select
    value={experience}
    onChange={(e) => setExperience(e.target.value)}
    className="px-4 py-3 rounded-lg border"
  >
    <option value="">All Experience</option>
    <option value="Fresher">Fresher</option>
    <option value="1-3 Years">1-3 Years</option>
    <option value="3-5 Years">3-5 Years</option>
    <option value="5+ Years">5+ Years</option>
  </select>

  {/* VERIFICATION */}
  <select
    value={verification}
    onChange={(e) => setVerification(e.target.value)}
    className="px-4 py-3 rounded-lg border"
  >
    <option value="">All Verification</option>
    <option value="grey">Silver</option>
    <option value="blue">Blue</option>
    <option value="gold">Gold</option>
  </select>

  {/* MERIT SCORE */}
  <select
    value={minimumScore}
    onChange={(e) => setMinimumScore(e.target.value)}
    className="px-4 py-3 rounded-lg border"
  >
    <option value="">All Scores</option>
    <option value="100">100+</option>
    <option value="200">200+</option>
    <option value="300">300+</option>
  </select>

</div>

        {/* RESULTS */}
        <div className="mt-10 space-y-6">
          {loading && (
  <p className="text-gray-600">
    Loading engineers...
  </p>
)}

          {filtered.length === 0 && (
            <p className="text-gray-600">No engineers found.</p>
          )}

          {filtered.map((eng, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition flex justify-between items-center"
            >

              <div>
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {eng.name || "Unnamed Engineer"}
                  </h2>
                  {eng.badge && (
  <VerifiedBadge type={eng.badge as any} />
)}
                </div>

                <div className="mt-1">

  <div className="flex gap-4 mt-1 text-sm text-gray-500">

    <p>
      {eng.experience || "Fresher"}
    </p>

    <p>
      {eng.location || "India"}
    </p>

  </div>

</div>

                <p className="mt-2 text-green-700 font-semibold">
                  Merit Score: {eng.meritScore || 0}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {typeof eng.skills === "string" &&
  eng.skills
    .split(",")
    .map((s: string, i: number) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))
                  }

                </div>
              </div>

             <div className="flex flex-col gap-3">

  <button
    onClick={() =>
      router.push(`/dashboard/recruiter/view/${eng.id}`)
    }
    className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-80"
  >
    View Profile
  </button>

  <button
  onClick={() => saveEngineer(eng.id)}
  className="border px-6 py-2 rounded-lg hover:bg-gray-100"
>
  Save
</button>

</div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}