import MetricSummary from "@/components/MetricSummary";
import TableReviews from "@/components/TableReviews";
import { supabase } from "../../../../libs/supabase";

async function getSurvey(id) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Survey not found");
  return data;
}

export default async function SurveyResponses({ params }) {
  const survey = await getSurvey(params.surveyID);
  const surveyID = params; 
  return (
    <div className="flex flex-col justify-center items-center md:max-w-2xl mx-auto">
      <MetricSummary id={params} />
      <TableReviews id={params} />
    </div>
  );
}
