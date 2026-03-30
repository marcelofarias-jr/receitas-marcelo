"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecipeRefresher() {
  const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource("/api/updates");

    eventSource.onmessage = () => {
      router.refresh();
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

  return null;
}
