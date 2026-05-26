"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

/* ✅ VERIFIED BADGE */
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

export default function ProfilePage() {
const [loading, setLoading] = useState(true);
const [editMode, setEditMode] = useState(false);

const [meritScore, setMeritScore] = useState(0);
const [views, setViews] = useState(0);
const [showInfo, setShowInfo] = useState(false);
const [breakdown, setBreakdown] = useState({
  profile: 0,
  projects: 0,
  challenges: 0,
  verification: 0,
});

const [profile, setProfile] = useState<any>({
name: "",
qualification: "",
skills: "",
bio: "",
experience: "",
projects: [],
badge: null,
accountType: "engineer",
professionalRole: "",
});

/* 🧠 MERIT SCORE CALCULATION */
function calculateScore(data: any) {
let profileScore = 0;
let projectScore = 0;
let verificationScore = 0;
let challengeScore = data.challengeScore || 0;

// Profile
if (data.name) profileScore += 50;
if (data.qualification) profileScore += 50;
if (data.skills) profileScore += 50;
if (data.bio) profileScore += 50;
if (data.experience) profileScore += 50;

// Projects
if (Array.isArray(data.projects)) {
  projectScore = Math.min(data.projects.length * 50, 200);
}

verificationScore = 0;

if (data.githubLinked) {
  verificationScore += 100;
}

if (data.isVerified) {
  verificationScore += 100;
}
// ✅ SAVE BREAKDOWN
setBreakdown({
  profile: profileScore,
  projects: projectScore,
  challenges: challengeScore,
  verification: verificationScore,
});

return Math.min(
  profileScore + projectScore + verificationScore + challengeScore,
  1000
);
}

/* 🔥 LOAD USER DATA */
useEffect(() => {
const unsub = onAuthStateChanged(auth, async (user) => {
if (!user) {
setLoading(false);
return;
}

const ref = doc(db, "users", user.uid);

// 🔥 CREATE ALL DEFAULT FIELDS
const existingSnap = await getDoc(ref);

if (!existingSnap.exists()) {
  await setDoc(ref, {
    // BASIC
    name: "",
    email: user.email || "",
    role: "engineer",
    accountType: "engineer",

    // PROFILE
    professionalRole: "",
    qualification: "",
    skills: "",
    bio: "",
    experience: "",
    projects: [],

    // MERIT
    meritScore: 0,
    recruiterViews: 0,
    challengeScore: 0,

    // VERIFICATION
    isVerified: false,
    githubLinked: false,

    // SUBSCRIPTION
    subscription: "free",
    subscriptionExpiresAt: 0,

    // BADGE
    badge: null,

    // OPTIONAL
    viewedBy: [],
  });
}

// 🔥 NOW FETCH UPDATED DATA
const snap = await getDoc(ref);
if (snap.exists()) {
const data = snap.data();
const safeData = {
  ...data,
  subscription: data.subscription ?? "free",
  subscriptionExpiresAt: Number(data.subscriptionExpiresAt) || 0,
  isVerified: data.isVerified ?? false,
};
// 🔥 AUTO BADGE LOGIC WITH EXPIRY
const now = Date.now();

let badge = null;

if (
  safeData.subscription === "gold" &&
  safeData.subscriptionExpiresAt > now
) {
  badge = "gold";
}
else if (
  safeData.subscription === "blue" &&
  safeData.subscriptionExpiresAt > now
) {
  badge = "blue";
}
else if (safeData.isVerified) {
  badge = "grey";
}

const userData = {    
  name: data.name || "",    
  qualification: data.qualification || "",    
  skills:    
    typeof data.skills === "string"    
      ? data.skills    
      : Array.isArray(data.skills)    
      ? data.skills.join(",")    
      : "",    
  bio: data.bio || "",    
  experience: data.experience || "",
  projects: Array.isArray(data.projects) ? data.projects : [],    
  badge: badge,    
  accountType: data.accountType || "engineer",    
  professionalRole: data.professionalRole || "",    
  challengeScore: data.challengeScore || 0, 
  githubLinked: data.githubLinked || false,
isVerified: data.isVerified || false,   
};    

setProfile(userData);    

const score = calculateScore(userData);    
setMeritScore(score);    

setViews(data.recruiterViews || 0);    

// 🔥 SAVE updated score to DB    
await setDoc(    
  ref,    
  {    
    meritScore: score,    
  },    
  { merge: true }    
);

}

setLoading(false);
});

return () => unsub();

}, []);

/* 🔥 SAVE */
async function handleSave() {
const user = auth.currentUser;
if (!user) return;

const score = calculateScore(profile);
setMeritScore(score);

await setDoc(
doc(db, "users", user.uid),
{
...profile,
meritScore: score,
projects: Array.isArray(profile.projects)
? profile.projects
: [],
},
{ merge: true }
);

setEditMode(false);

}

if (loading) {
return (

<div className="min-h-screen flex items-center justify-center bg-[#dcefe8]">  
Loading...  
</div>  
);  
}  return (

<div className="min-h-screen bg-[#dcefe8] px-20 py-10">  {/* HEADER */}

  <div className="flex justify-between mb-10">    
    <div>    {/* NAME */}    
  {editMode ? (    
    <input    
      value={profile.name}    
      onChange={(e) =>    
        setProfile((prev: any) => ({    
          ...prev,    
          name: e.target.value,    
        }))    
      }    
      className="text-3xl font-bold border-b outline-none bg-transparent"    
    />    
  ) : (    
    <h1 className="text-3xl font-bold flex items-center">    
      {profile.name || "Your Name"}    
     {profile.badge && <VerifiedBadge type={profile.badge} />} 
    </h1>    
  )}    

  {/* ROLE */}    
  {editMode ? (    
    <input    
      value={profile.professionalRole || ""}    
      onChange={(e) =>    
        setProfile((prev: any) => ({    
          ...prev,    
          professionalRole: e.target.value,    
        }))    
      }    
      placeholder="Your Role"    
      className="text-gray-600 border-b outline-none bg-transparent"    
    />    
  ) : (    
    <p className="text-gray-600">    
      {profile.professionalRole || "Add your role"}    
    </p>    
  )}    
</div>    

{/* 🔥 SCORE DISPLAY */}    
<div className="text-sm text-right">    
  <div className="flex items-center justify-end gap-1">

  <p>Merit Score: {meritScore} / 1000</p>  <button  
onClick={() => setShowInfo(true)}  
className="text-gray-500 hover:text-black"  > 

ⓘ

  </button>    
</div>    
          <p>Recruiter Views: {views}</p>    
        </div>    
      </div>  {/* CONTENT */}    
  <div className="space-y-6">    {/* Qualification */}    
<div className="bg-white p-6 rounded-xl">    
  <h2 className="font-semibold mb-2">Qualification</h2>    

  {editMode ? (    
    <textarea    
      value={profile.qualification}    
      onChange={(e) =>    
        setProfile((prev: any) => ({    
          ...prev,    
          qualification: e.target.value,    
        }))    
      }    
      className="w-full border rounded p-2 outline-none"    
      rows={3}    
    />    
  ) : (    
    <p className="whitespace-pre-line">    
      {profile.qualification}    
    </p>    
  )}    
</div>    

{/* Skills */}    
<div className="bg-white p-6 rounded-xl">    
  <h2 className="font-semibold mb-2">Skills</h2>    

  {editMode ? (    
    <textarea    
      value={profile.skills}    
      onChange={(e) =>    
        setProfile((prev: any) => ({    
          ...prev,    
          skills: e.target.value,    
        }))    
      }    
      className="w-full border rounded p-2 outline-none"    
    />    
  ) : (    
    <div className="flex gap-2 flex-wrap">    
      {typeof profile.skills === "string" &&    
      profile.skills.length > 0 ? (    
        profile.skills.split(",").map((skill: string, i: number) => (    
          <span    
            key={i}    
            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"    
          >    
            {skill.trim()}    
          </span>    
        ))    
      ) : (    
        <p>No skills</p>    
      )}    
    </div>    
  )}    
</div>    

{/* Bio */}    
<div className="bg-white p-6 rounded-xl">    
  <h2 className="font-semibold mb-2">Bio</h2>    

  {editMode ? (    
    <textarea    
      value={profile.bio}    
      onChange={(e) =>    
        setProfile((prev: any) => ({    
          ...prev,    
          bio: e.target.value,    
        }))    
      }    
      className="w-full border rounded p-2 outline-none"    
      rows={3}    
    />    
  ) : (    
    <p className="whitespace-pre-line">{profile.bio}</p>    
  )}    
</div>    

{/* Experience */}
<div className="bg-white p-6 rounded-xl">
  <h2 className="font-semibold mb-2">Experience</h2>

  {editMode ? (
    <textarea
      value={profile.experience}
      onChange={(e) =>
        setProfile((prev: any) => ({
          ...prev,
          experience: e.target.value,
        }))
      }
      className="w-full border rounded p-2 outline-none"
      rows={4}
    />
  ) : (
    <p className="whitespace-pre-line">
      {profile.experience || "No experience added"}
    </p>
  )}
</div>

{/* Projects */}    
<div className="bg-white p-6 rounded-xl">    
  <h2 className="font-semibold mb-2">Projects</h2>    

  {Array.isArray(profile.projects) &&    
  profile.projects.length > 0 ? (    
    profile.projects.map((project: any, i: number) => (    
      <div key={i} className="mb-3">    
        <p className="font-semibold">{project.title}</p>    
        <p className="text-sm text-gray-600">    
          {project.description}    
        </p>    
      </div>    
    ))    
  ) : (    
    <p>No projects</p>    
  )}    
</div>

  </div>    {/* BUTTONS */}

  <div className="flex justify-center mt-10 gap-4">    
    {editMode ? (    
      <>    
        <button    
          onClick={() => setEditMode(false)}    
          className="border px-6 py-2 rounded"    
        >    
          Cancel    
        </button>    <button    
      onClick={handleSave}    
      className="bg-green-600 text-white px-8 py-3 rounded-lg"    
    >    
      Save Profile    
    </button>    
  </>    
) : (    
  <button    
    onClick={() => setEditMode(true)}    
    className="bg-green-600 text-white px-8 py-3 rounded-lg"    
  >    
    Edit Profile    
  </button>    
)}

  </div>    
{showInfo && (    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">    
    <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg max-h-[80vh] overflow-y-auto">  <h2 className="text-lg font-semibold mb-3">    
    Merit Score    
  </h2>      <p className="text-sm mb-4">    
    Merit Score helps recruiters evaluate your skills.    
  </p>      <p className="text-sm font-medium mb-2">    
    How to increase your score:    
  </p>      <ul className="text-sm space-y-1 mb-4">    
    <li>• Complete your profile (+250 max)</li>    
    <li>• Solve skill challenges (+400 max)</li>    
    <li>• Add strong projects (+200 max)</li>    
    <li>• Verify your account (+200 max)</li>    
  </ul>      <p className="text-sm italic mb-4">    
    Tip: Focus on challenges — they give the highest score.    
  </p>  
  {/* 🔥 BREAKDOWN */}
<div className="border-t pt-4 mt-4 text-sm space-y-3">

  <p className="font-semibold">Your Score Breakdown</p>

  <p>Profile: {breakdown.profile} / 250</p>
  <div className="w-full bg-gray-200 h-2 rounded">
    <div
      className="bg-green-500 h-2 rounded"
      style={{ width: `${(breakdown.profile / 250) * 100}%` }}
    />
  </div>

  <p>Projects: {breakdown.projects} / 200</p>
  <div className="w-full bg-gray-200 h-2 rounded">
    <div
      className="bg-blue-500 h-2 rounded"
      style={{ width: `${(breakdown.projects / 200) * 100}%` }}
    />
  </div>

  <p>Challenges: {breakdown.challenges} / 400</p>
  <div className="w-full bg-gray-200 h-2 rounded">
    <div
      className="bg-purple-500 h-2 rounded"
      style={{ width: `${(breakdown.challenges / 400) * 100}%` }}
    />
  </div>

  <p>Verification: {breakdown.verification} / 200</p>
  <div className="w-full bg-gray-200 h-2 rounded">
    <div
      className="bg-yellow-500 h-2 rounded"
      style={{ width: `${(breakdown.verification / 200) * 100}%` }}
    />
  </div>

</div>
{/* ⚡ SUGGESTIONS */}
<div className="border-t pt-4 mt-4 text-sm space-y-2">

  <p className="font-semibold"> Improve your score:</p>

  {breakdown.challenges < 400 && (
    <p>• Complete challenges (+{400 - breakdown.challenges})</p>
  )}

  {breakdown.projects < 200 && (
    <p>
      • Add {Math.ceil((200 - breakdown.projects) / 50)} more projects (+{200 - breakdown.projects})
    </p>
  )}

  {breakdown.profile < 200 && (
    <p>• Complete your profile (+{250 - breakdown.profile})</p>
  )}

  {breakdown.verification < 200 && (
    <p>• Verify your account (+200)</p>
  )}

</div>

<button
  onClick={() => setShowInfo(false)}
  className="w-full bg-black text-white py-2 rounded-lg mt-4"
>
  Close
</button>

</div>
</div>
)}    
    </div>    
  );    
}