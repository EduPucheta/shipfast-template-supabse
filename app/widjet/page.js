"use client";
import PreviewSurvey from "@/components/PreviewSurvey";
import { useEffect } from "react";

export default function WidgetPage() {
  useEffect(() => {
    const sendHeight = () => {
      const height = document.getElementById('root').scrollHeight;
      window.parent.postMessage({ type: 'height', height }, '*');
    };

    // Send initial height
    sendHeight();

    // Create a mutation observer to watch for height changes
    const observer = new MutationObserver(sendHeight);
    observer.observe(document.getElementById('root'), {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div>Survey widget2</div>
      <div id="root" className="w-full">
        <PreviewSurvey isPreview={false} surveyID={42} />
      </div>
    </div>
  );
}
