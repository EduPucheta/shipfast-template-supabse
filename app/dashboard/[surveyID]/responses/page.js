import MetricSummary from "@/components/MetricSummary";
import TableReviews from "@/components/TableReviews";
import { supabase } from "../../../../libs/supabase";
import { data } from "autoprefixer";

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

  
  return (
    <div className="flex flex-col justify-center items-start md:max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold">{survey.survey_title}</h1>
      <p className="text-base text-gray-600">{survey.survey_description}</p>
      <MetricSummary id={params} />
      <TableReviews id={params} />
    </div>
  );
}
