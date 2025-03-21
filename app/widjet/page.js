"use client";
import PreviewSurvey from "@/components/PreviewSurvey";

export default function WidgetPage() {
  return (
    <div className="bg-transparent">
      <PreviewSurvey isPreview={false} surveyID={42} />
    </div>
  );
}
