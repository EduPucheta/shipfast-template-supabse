"use client";
import PreviewSurvey from "@/components/PreviewSurvey";
import { useEffect } from "react";

export default function WidgetPage() {
  useEffect(() => {
    // Notify the parent window that the survey is loaded
    window.parent.postMessage({ type: 'surveyLoaded' }, '*');
  }, []);

  return (
    <div className="w-full h-screen">
      <PreviewSurvey isPreview={false} surveyID={42} />
    </div>
  );
}
