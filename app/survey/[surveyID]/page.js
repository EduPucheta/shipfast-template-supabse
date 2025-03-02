import { supabase } from "../../../libs/supabase";
import PreviewSurvey from "@/components/PreviewSurvey";

async function getSurvey(id) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Survey not found");
  return data;
}

export default async function Survey({ params }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      
        <PreviewSurvey isPreview={false} surveyID={params.surveyID} />
      
    </div>
  );
}
