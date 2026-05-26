"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EngineerHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/engineer/profile");
  }, []);

  return null;
}