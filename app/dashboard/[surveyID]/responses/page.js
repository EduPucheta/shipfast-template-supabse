"use client";

import MetricSummary from "@/components/MetricSummary";
import TableReviews from "@/components/TableReviews";
import { supabase } from "../../../../libs/supabase";
import PreviewSurvey from "@/components/PreviewSurvey";
import { notFound } from "next/navigation";
import AskAI from "@/components/AskAI";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SurveyAnalytics from "@/components/SurveyAnalytics";

dayjs.extend(relativeTime);

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

export default function SurveyResponses({ params }) {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      const data = await getSurvey(params.surveyID);
      setSurvey(data);
      setLoading(false);
    };

    fetchSurvey();
  }, [params.surveyID]);

  const handleToggle = async () => {
    if (!survey) return;

    try {
      const newStatus = !survey.is_active;
      const { error } = await supabase
        .from("surveys")
        .update({ is_active: newStatus })
        .eq("id", params.surveyID);

      if (error) {
        toast.error("Failed to update survey status");
        return;
      }

      setSurvey(prev => ({ ...prev, is_active: newStatus }));
      toast.success(`Survey is now ${newStatus ? "active" : "inactive"}`);
    } catch (err) {
      console.error("Error updating survey status:", err);
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-start p-24 py-6 bg-base-200 ">
        <div className="flex flex-row justify-between items-center w-full mb-4 ">
          <div className="flex flex-row items-center gap-4">
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={survey.is_active}
                onChange={handleToggle}
              />
            </div>
            <div
              className="tooltip"
              data-tip={dayjs(survey.created_at).format(
                "MMMM D, YYYY [at] h:mm A"
              )}
            >
              <p className="text-sm text-gray-500">
                Created on {dayjs(survey.created_at).format("MMMM D, YYYY")}
              </p>
            </div>
          </div>
        </div>
        <p className="text-base text-gray-600">{survey.survey_description}</p>
        <MetricSummary id={params} />
        {/* name of each tab group should be unique */}
      </div>
      <div className="tabs tabs-border bg-base-200 px-24  ">
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="User responses"
          defaultChecked
        />
        <div className="tab-content min-h-screen bg-base-100  p-2">
          {" "}
          <TableReviews id={params} />
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Analytics"
        />
        <div className="tab-content min-h-screen bg-base-100  p-2">  <SurveyAnalytics id={params} /></div>
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Ask AI"
        />
        <div className="tab-content min-h-screen bg-base-100  p-2">
          <AskAI id={params} />
        </div>
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Preview"
        />
        <div className="tab-content min-h-screen bg-base-100  p-2">
          <PreviewSurvey isPreview={true} id={params} />
        </div>

      </div>
    </div>
  );
}
