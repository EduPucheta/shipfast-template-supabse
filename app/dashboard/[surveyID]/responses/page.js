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

  return (
    <div className="flex flex-col justify-center items-start md:max-w-2xl mx-auto py-6">
      <div className="flex flex-row justify-center items-center gap-4 w">
        <div
          className="inline-grid *:[grid-area:1/1] tooltip"
          data-tip={survey.is_active ? "Survey is live and receiving responses" : "Survey is not active"}
        >
          <div
            className={`status status-lg ${survey.is_active ? "status-success" : "status-error"} animate-ping`}
          ></div>
          <div
            className={`status status-lg ${survey.is_active ? "status-success" : "status-error"}`}
          ></div>
        </div>
        <h1 className="text-2xl font-bold">{survey.survey_title}</h1>
      </div>
      <p className="text-base text-gray-600">{survey.survey_description}</p>
      <MetricSummary id={params} />
      <TableReviews id={params} />
    </div>
  );
}
