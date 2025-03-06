"use client";
import FeedbackWidget from "@/components/FeedbackWidget";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

export const dynamic = 'force-static'; // This will generate static HTML + JS at build time

export default function IframePage({ searchParams }) {
  const { apiKey, projectId, theme } = searchParams;

  useEffect(() => {
    const container = document.getElementById("root");
    if (container) {
      const root = createRoot(container);
      root.render(
        <div className={theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}>
          <FeedbackWidget apiKey={apiKey} projectId={projectId} />
        </div>
      );
    }
  }, [apiKey, projectId, theme]);

  return null;
}
