"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const supabase = createClientComponentClient();

const SurveyNav = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return; // Wait until userId is set

    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("surveys")
          .select("survey_title, id, created_at")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching surveys:", error);
          return;
        }

        // Remove duplicate surveys based on survey_title if necessary
        const uniqueSurveys = Array.from(
          new Map(data.map((survey) => [survey.survey_title, survey])).values()
        );

        setSurveys(uniqueSurveys);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Survey Title</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Survey Link</th>
            <th className="px-4 py-2">View Responses</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map(({ id, survey_title, created_at }) => (
            <tr key={id} className="border-t">
              <td className="px-4 py-2">{survey_title}</td>
              <td className="px-4 py-2">{dayjs(created_at).fromNow()}</td>
              <td className="px-4 py-2">
                <a href={`/survey/${id}`} className="text-blue-500 underline">
                  View Survey
                </a>
              </td>
              <td className="px-4 py-2">
                <a
                  href={`/dashboard/${id}/responses`}
                  className="text-blue-500 underline"
                >
                  View Responses
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyNav;
