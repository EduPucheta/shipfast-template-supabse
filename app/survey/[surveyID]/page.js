
import PreviewSurvey from "@/components/PreviewSurvey";



export default async function Survey(props) {
  const params = await props.params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      
        <PreviewSurvey isPreview={false} surveyID={params.surveyID} showDeviceToggles={false} />
      
    </div>
  );
}
