import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className} bg-[#0F172A] text-[#F8FAFC] min-h-screen`}>

      {/* NAVBAR */}

      <nav className="border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <h1 className="text-xl font-semibold">MeritLayer</h1>

          <div className="flex gap-6 text-[#94A3B8]">

            <Link href="/login">Login</Link>

            <Link
              href="/signup"
              className="bg-[#4F46E5] px-5 py-2 rounded-lg text-white"
            >
              Sign up
            </Link>

          </div>

        </div>
      </nav>



      {/* HERO */}

      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}

        <div>

          <h1 className="text-6xl font-bold leading-tight">

            Hire engineers

            <span className="block text-[#4F46E5]">
              verified by skill
            </span>

          </h1>

          <p className="mt-6 text-lg text-[#94A3B8] max-w-xl">

            MeritLayer verifies engineers through coding challenges and
            real technical projects so companies hire based on proven skill.

          </p>

          <div className="mt-10 flex gap-4">

            <Link
              href="/signup"
              className="bg-[#4F46E5] px-8 py-4 rounded-xl font-semibold"
            >
              Get Started
            </Link>

            <Link
              href="/engineers"
              className="border border-[#1E293B] px-8 py-4 rounded-xl text-[#94A3B8]"
            >
              View Engineers
            </Link>

          </div>

        </div>



        {/* RIGHT SIDE PANEL */}

        <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#263244] shadow-xl space-y-4">

          {/* CARD */}

          <div className="bg-[#0F172A] p-4 rounded-xl flex justify-between items-center">

            <div>
              <p className="font-semibold">Aman Verma</p>
              <p className="text-sm text-[#94A3B8]">Full Stack Engineer</p>
            </div>

            <span className="text-[#22C55E] font-semibold">
              91 Merit
            </span>

          </div>


          <div className="bg-[#0F172A] p-4 rounded-xl flex justify-between items-center">

            <div>
              <p className="font-semibold">Sara Khan</p>
              <p className="text-sm text-[#94A3B8]">AI Engineer</p>
            </div>

            <span className="text-[#22C55E] font-semibold">
              94 Merit
            </span>

          </div>


          <div className="bg-[#0F172A] p-4 rounded-xl flex justify-between items-center">

            <div>
              <p className="font-semibold">David Kim</p>
              <p className="text-sm text-[#94A3B8]">Backend Engineer</p>
            </div>

            <span className="text-[#22C55E] font-semibold">
              88 Merit
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}