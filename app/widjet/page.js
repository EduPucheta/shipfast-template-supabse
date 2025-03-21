"use client";
import PreviewSurvey from "@/components/PreviewSurvey";

export default function WidgetPage() {
  return (
    <div className="widget-wrapper">
      <PreviewSurvey isPreview={false} surveyID={42} />
    </div>
  );
}
