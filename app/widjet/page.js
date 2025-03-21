"use client";
import PreviewSurvey from "@/components/PreviewSurvey";

export default function WidgetPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white h-80">
      <div>Survey widget2</div>
      <div id="root">
        <PreviewSurvey />
      </div>
    </div>
  );
}
