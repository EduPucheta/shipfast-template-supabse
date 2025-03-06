"use client";
import FeedbackWidget from "@/components/FeedbackWidget"; // Tu componente

export default function IframePage({ searchParams }) {
  const { apiKey, projectId } = searchParams;

  if (!apiKey || !projectId) {
    return <div>Invalid widget configuration</div>;
  }

  return (
    <div>
      <FeedbackWidget apiKey={apiKey} projectId={projectId} />
    </div>
  );
}
