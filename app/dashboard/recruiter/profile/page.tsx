"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";

export default function RecruiterProfilePage() {
    const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [profileType, setProfileType] =
    useState("company");

  const [recruiterName, setRecruiterName] =
    useState("");

  const [companyName, setCompanyName] =
    useState("");

  const [companyType, setCompanyType] =
    useState("startup");

  const [website, setWebsite] =
    useState("");

  const [linkedin, setLinkedin] =
    useState("");

  const [companySize, setCompanySize] =
    useState("");

  const [about, setAbout] =
    useState("");

  const [email, setEmail] =
    useState("");

  useEffect(() => {

    const unsubscribe =
      auth.onAuthStateChanged(
        async (user) => {

          if (!user) return;

          try {

            const ref = doc(
              db,
              "recruiters",
              user.uid
            );

            const snap = await getDoc(ref);

            if (snap.exists()) {

              const data = snap.data();

              setRecruiterName(
                data.recruiterName || ""
              );

              setCompanyName(
                data.companyName || ""
              );

              setCompanyType(
                data.companyType || "startup"
              );

              setWebsite(
                data.website || ""
              );

              setLinkedin(
                data.linkedin || ""
              );

              setCompanySize(
                data.companySize || ""
              );

              setAbout(
                data.about || ""
              );

              setProfileType(
                data.profileType || "company"
              );

              setEmail(
                data.email || ""
              );
            }

          } catch (error) {
            console.log(error);
          }

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  async function saveProfile() {

    try {

      setSaving(true);

      const user = auth.currentUser;

      if (!user) return;

      const ref = doc(
        db,
        "recruiters",
        user.uid
      );

      await updateDoc(ref, {

        recruiterName,
        companyName,
        companyType,
        website,
        linkedin,
        companySize,
        about,
        profileType,

      });

      alert("Profile updated");

router.push("/dashboard/recruiter");

    } catch (error) {

      console.log(error);

      alert("Failed to save profile");

    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dcefe8] p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold text-gray-900">
            Recruiter Profile
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Complete your recruiter/company information.
          </p>

        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl p-10 shadow-md">

          {/* PROFILE TYPE */}
          <div className="mb-8">

            <label className="block text-sm text-gray-600 mb-3">
              Profile Type
            </label>

            <div className="flex gap-4">

              <button
                onClick={() =>
                  setProfileType("individual")
                }
                className={`px-6 py-3 rounded-xl border ${
                  profileType === "individual"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                Individual
              </button>

              <button
                onClick={() =>
                  setProfileType("company")
                }
                className={`px-6 py-3 rounded-xl border ${
                  profileType === "company"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                Company
              </button>

            </div>

          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* RECRUITER NAME */}
            <div>

              <label className="block text-sm text-gray-600 mb-2">
                Recruiter Name
              </label>

              <input
                value={recruiterName}
                onChange={(e) =>
                  setRecruiterName(
                    e.target.value
                  )
                }
                placeholder="Enter recruiter name"
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            {/* COMPANY NAME */}
            <div>

              <label className="block text-sm text-gray-600 mb-2">
                Company Name
              </label>

              <input
                value={companyName}
                onChange={(e) =>
                  setCompanyName(
                    e.target.value
                  )
                }
                placeholder="Enter company name"
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            {/* EMAIL */}
            <div>

              <label className="block text-sm text-gray-600 mb-2">
                Email
              </label>

              <input
                value={email}
                disabled
                className="w-full border rounded-xl px-4 py-3 bg-gray-100"
              />

            </div>

            {/* COMPANY TYPE */}
            <div>

              <label className="block text-sm text-gray-600 mb-2">
                Company Type
              </label>

              <select
                value={companyType}
                onChange={(e) =>
                  setCompanyType(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="startup">
                  Startup
                </option>

                <option value="agency">
                  Agency
                </option>

                <option value="enterprise">
                  Enterprise
                </option>

              </select>

            </div>

            {/* WEBSITE */}
            <div>

              <label className="block text-sm text-gray-600 mb-2">
                Website
              </label>

              <input
                value={website}
                onChange={(e) =>
                  setWebsite(
                    e.target.value
                  )
                }
                placeholder="https://"
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            {/* LINKEDIN */}
            <div>

              <label className="block text-sm text-gray-600 mb-2">
                LinkedIn
              </label>

              <input
                value={linkedin}
                onChange={(e) =>
                  setLinkedin(
                    e.target.value
                  )
                }
                placeholder="LinkedIn profile"
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            {/* COMPANY SIZE */}
            <div>

              <label className="block text-sm text-gray-600 mb-2">
                Company Size
              </label>

              <input
                value={companySize}
                onChange={(e) =>
                  setCompanySize(
                    e.target.value
                  )
                }
                placeholder="10 employees"
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

          </div>

          {/* ABOUT */}
          <div className="mt-8">

            <label className="block text-sm text-gray-600 mb-2">
              About Company
            </label>

            <textarea
              value={about}
              onChange={(e) =>
                setAbout(
                  e.target.value
                )
              }
              rows={6}
              placeholder="Describe your company..."
              className="w-full border rounded-2xl px-4 py-4"
            />

          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-8 bg-black text-white px-8 py-4 rounded-2xl hover:opacity-80 transition"
          >

            {saving
              ? "Saving..."
              : "Save Profile"}

          </button>

        </div>

      </div>

    </div>
  );
}