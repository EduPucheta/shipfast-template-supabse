"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {Link} from "lucide-react";

dayjs.extend(relativeTime);

const supabase = createClientComponentClient();

const SurveyNav = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [responseCounts, setResponseCounts] = useState({});

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
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching surveys:", error);
          return;
        }

        // Remove duplicate surveys based on survey_title if necessary
        const uniqueSurveys = Array.from(
          new Map(data.map((survey) => [survey.survey_title, survey])).values()
        );

        setSurveys(uniqueSurveys);

        // Fetch response counts for each survey
        const counts = {};
        for (const survey of uniqueSurveys) {
          const { count, error: countError } = await supabase
          .from("reviews")
          .select("id", { count: "exact", head: true }) 
          .eq("survey", survey.id);

          console.log(survey.id);
        

          if (countError) {
            console.error("Error counting responses:", countError);
            counts[survey.id] = 0;
          } else {
            counts[survey.id] = count || 0;
          }
        }
        setResponseCounts(counts);
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
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table className="table">
        <thead>
          <tr>
            <th className="px-4 py-2">Survey Title</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Responses</th>
            <th className="px-4 py-2">Survey Link</th>
            <th className="px-4 py-2">View Responses</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map(({ id, survey_title, created_at }) => (
            <tr key={id} className="border-t">
              <td className="px-4 py-2">{survey_title}</td>
              <td className="px-4 py-2">
                <span title={dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}>
                  {dayjs(created_at).fromNow()}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-5 w-5 stroke-current mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                  <span>{responseCounts[id] || 0}</span>
                </div>
              </td>
              <td className="px-4 py-2">
                <a href={`/survey/${id}`} className="text-blue-500 underline flex items-center justify-center">
                 <Link />
                </a>
              </td>
              <td className="px-4 py-2">
                <a
                  href={`/dashboard/${id}/responses`}
                  className="text-blue-500 underline"
                >
                  <button className="btn btn-outline">View Responses</button>
               
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