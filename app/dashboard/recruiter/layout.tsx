"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard/recruiter",
    },
    {
  name: "Discover Engineers",
  href: "/dashboard/recruiter/search",
},
    {
      name: "Saved",
      href: "/dashboard/recruiter/saved",
    },
    {
      name: "Opportunities",
      href: "/dashboard/recruiter/opportunities",
    },
    {
      name: "Subscription",
      href: "/dashboard/recruiter/subscription",
    },
    {
      name: "Settings",
      href: "/dashboard/recruiter/settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#dcefe8]">

      {/* SIDEBAR */}
      <div className="w-[260px] bg-white border-r border-gray-200 p-6">

        {/* LOGO */}
        <Link href="/">
          <div className="mb-12 cursor-pointer">

            <h1 className="text-4xl font-bold text-gray-900 hover:opacity-80 transition">
              MeritOrbit
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Recruiter Panel
            </p>

          </div>
        </Link>

        {/* NAVIGATION */}
        <div className="space-y-2">

          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`px-4 py-3 rounded-xl transition cursor-pointer font-medium ${
                    active
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </div>
              </Link>
            );
          })}

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {children}
      </div>

    </div>
  );
}