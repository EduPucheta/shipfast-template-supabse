import MetricSummary from "@/components/MetricSummary";
import TableReviews from "@/components/TableReviews";
import { supabase } from "../../../../libs/supabase";
import PreviewSurvey from "@/components/PreviewSurvey";
import { notFound } from "next/navigation";

async function getSurvey(id) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }
  return data;
}

export default async function SurveyResponses({ params }) {
  const survey = await getSurvey(params.surveyID);

  return (
    <div className="flex flex-col justify-center items-start md:max-w-2xl mx-auto py-6">
      <div className="flex flex-row justify-center items-center gap-4 w">
        <div
          className="inline-grid *:[grid-area:1/1] tooltip"
          data-tip={
            survey.is_active
              ? "Survey is live and receiving responses"
              : "Survey is not active"
          }
        >
          <div
            className={`status status-lg ${
              survey.is_active ? "status-success" : "status-error"
            } animate-ping`}
          ></div>
          <div
            className={`status status-lg ${
              survey.is_active ? "status-success" : "status-error"
            }`}
          ></div>
        </div>
        <h1 className="text-2xl font-bold">{survey.survey_title}</h1>
      </div>
      <p className="text-base text-gray-600">{survey.survey_description}</p>
      <MetricSummary id={params} />
      {/* name of each tab group should be unique */}
      <div className="tabs tabs-lift">
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="User responses"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 p-2">
          {" "}
          <TableReviews id={params} />
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Analytics"
         
        />
        <div className="tab-content bg-base-100 border-base-300 p-2">
          Tab content 2
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Survey preview"
        />
        <div className="tab-content bg-base-100 border-base-300 p-2">
          <PreviewSurvey isPreview={true} id={params} />
        </div>
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Ask AI"
        />
        <div className="tab-content bg-base-100 border-base-300 p-2">
       
        </div>
      </div>
    </div>
  );
}
