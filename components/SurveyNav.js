"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "lucide-react";
import { toast } from "react-hot-toast";
import { EllipsisVertical } from "lucide-react";
import { Trash2 } from "lucide-react";
import DeleteModal from "./DeleteModal";

dayjs.extend(relativeTime);

const supabase = createClientComponentClient();

const SurveyNav = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [responseCounts, setResponseCounts] = useState({});
  const [updatingSurvey, setUpdatingSurvey] = useState(null);
  const [deletingSurvey, setDeletingSurvey] = useState(null);

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
    if (!userId) return;

    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("surveys")
          .select("survey_title, id, created_at, is_active")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching surveys:", error);
          return;
        }

        setSurveys(data);

        const counts = {};
        for (const survey of data) {
          const { count, error: countError } = await supabase
            .from("reviews")
            .select("id", { count: "exact", head: true })
            .eq("survey", survey.id);

          counts[survey.id] = count || 0;
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

  const handleToggle = async (surveyId, currentStatus) => {
    setUpdatingSurvey(surveyId);

    const newStatus = !currentStatus;
    const { error } = await supabase
      .from("surveys")
      .update({ is_active: newStatus })
      .eq("id", surveyId);

    if (error) {
      console.error("Error updating survey status:", error);
      toast.error("Failed to update status");
    } else {
      setSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey.id === surveyId ? { ...survey, is_active: newStatus } : survey
        )
      );
      toast.success("Survey status updated");
    }

    setUpdatingSurvey(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-box  border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Survey Title</th>
            <th>Created</th>
            <th>Responses</th>
            <th>Survey Link</th>
            <th>View Responses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map(({ id, survey_title, created_at, is_active }) => (
            <tr key={id} className="border-t">
              <td>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={is_active}
                  onChange={() => handleToggle(id, is_active)}
                />
              </td>
              <td>
                <a href={`/dashboard/${id}/responses`} className="underline">
                  {survey_title}
                </a>
              </td>
              <td>
                <span title={dayjs(created_at).format("YYYY-MM-DD HH:mm:ss")}>
                  {dayjs(created_at).fromNow()}
                </span>
              </td>
              <td>{responseCounts[id] || 0}</td>
              <td>
                <a
                  href={`/survey/${id}`}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  <Link />
                </a>
              </td>
              <td>
                <a href={`/dashboard/${id}/responses`}>
                  <button className="btn btn-outline">View Responses</button>
                </a>
              </td>
              <td>
                {/* change popover-1 and --anchor-1 names. Use unique names for each dropdown */}
                {/* For TSX uncomment the commented types below */}
                <button
                  className="btn btn-ghost"
                  popoverTarget={`popover-${id}`}
                  style={
                    {
                      anchorName: `--anchor-${id}`,
                    } /* as React.CSSProperties */
                  }
                >
                  <EllipsisVertical />
                </button>

                <ul
                  className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                  popover="auto"
                  id={`popover-${id}`} // unique id for each item
                  style={
                    {
                      positionAnchor: `--anchor-${id}`, // matching style for the dropdown
                    } /* as React.CSSProperties */
                  }
                >
                  <li>
                    <DeleteModal
                      object="survey"
                      objectID={id}
                      objectTitle={survey_title}
                      onDeleteSuccess={(deletedId) =>
                        setSurveys((prevSurveys) =>
                          prevSurveys.filter(
                            (survey) => survey.id !== deletedId
                          )
                        )
                      }
                    />
                  </li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyNav;
