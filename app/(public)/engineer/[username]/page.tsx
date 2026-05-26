import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function PublicProfile({ params }: any) {
  const username = params?.username;

  if (!username) {
    return <h1 className="text-center mt-10">Invalid URL</h1>;
  }

  const docRef = doc(db, "engineers", username);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    return <h1 className="text-center mt-10">User not found</h1>;
  }

  const data = snap.data();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">

        {/* NAME */}
        <div>
          <h1 className="text-red-500 text-5xl">TEST</h1>
          <p className="text-gray-500">{data.role}</p>
          <p className="text-green-600 font-semibold">
            Merit Score: {data.meritScore}
          </p>
        </div>

        {/* ABOUT */}
        <div>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700">{data.about}</p>
        </div>

        {/* SKILLS */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill: string, i: number) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}