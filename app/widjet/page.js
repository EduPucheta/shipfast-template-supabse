"use client";
import PreviewSurvey from "@/components/PreviewSurvey";

export default function WidgetPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen h-80 w-full z-[9999]">
      <div id="root" className="relative">
        <PreviewSurvey isPreview={false} surveyID={42} />
      </div>
    </div>
  );
}
