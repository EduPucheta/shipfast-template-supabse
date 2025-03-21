"use client";
import PreviewSurvey from "@/components/PreviewSurvey";


export default function WidgetPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-80 absolute top-0 left-0 w-full z-50">
   
        <div id="root">
          <PreviewSurvey isPreview={false} surveyID={42} />
        </div>
     
    </div>
  );
}
