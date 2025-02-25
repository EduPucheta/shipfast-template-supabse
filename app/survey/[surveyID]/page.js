import { supabase } from "../../../libs/supabase";
import DisplaySurvey from "@/components/DisplaySurvey";

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
  const survey = await getSurvey(params.surveyID);
  return (
    <div>
      <h1>Survey ID: {survey.survey_title}</h1>
      <div>
        <DisplaySurvey />
      </div>
    </div>
  );
}
