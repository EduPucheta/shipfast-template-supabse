"use client";
import PreviewSurvey from "@/components/PreviewSurvey";

export default function WidgetPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-80" >
      
      <div id="root">
        <PreviewSurvey isPreview={false} surveyID={42}  /> 
      </div>
    </div>
  );
}
