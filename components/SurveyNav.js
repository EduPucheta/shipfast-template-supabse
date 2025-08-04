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
import { useSpace } from "@/app/context/SpaceContext";

dayjs.extend(relativeTime);

const SurveyNav = () => {
  const supabase = createClientComponentClient();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [updatingSurvey, setUpdatingSurvey] = useState(null);
  const [deletingSurvey, setDeletingSurvey] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const { selectedSpace, addSpace, loading: spacesLoading } = useSpace();
  const [spaceName, setSpaceName] = useState("");
  const [spaceDomain, setSpaceDomain] = useState("");
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

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

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    if (!spaceName.trim()) {
      toast.error("Space name cannot be empty.");
      return;
    }
    if (!spaceDomain.trim()) {
      toast.error("Domain cannot be empty.");
      return;
    }
    setIsCreatingSpace(true);
    try {
      await addSpace(spaceName, spaceDomain);
      setSpaceName('');
      setSpaceDomain('');
      toast.success("Space created successfully!");
      // The context will handle re-fetching and re-rendering.
    } catch (error) {
      toast.error("Failed to create space.");
      console.error("Error creating space:", error);
    } finally {
      setIsCreatingSpace(false);
    }
  };

  useEffect(() => {
    if (!userId || !selectedSpace) {
      setSurveys([]);
      setLoading(false);
      return;
    }

    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("surveys")
          .select("survey_title, id, created_at, is_active, reviews(count), survey_devices(device_name)")
          .eq("user_id", userId)
          .eq("space_id", selectedSpace.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching surveys:", error);
          toast.error("Error fetching surveys");
          return;
        }

        const formattedSurveys = data.map((survey) => ({
          ...survey,
          response_count: survey.reviews[0]?.count || 0,
        }));

        setSurveys(formattedSurveys);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("An unexpected error occurred while fetching surveys.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [userId, selectedSpace]);

  const handleToggle = async (surveyId, currentStatus) => {
    setUpdatingSurvey(surveyId);

    try {
      const newStatus = !currentStatus;
      console.log('Attempting to update survey:', { surveyId, currentStatus, newStatus });
      
      // First verify the survey exists
      const { data: surveyData, error: fetchError } = await supabase
        .from("surveys")
        .select("id, is_active")
        .eq("id", surveyId)
        .single();

      if (fetchError) {
        console.error("Error fetching survey:", fetchError);
        toast.error("Failed to verify survey");
        return;
      }

      if (!surveyData) {
        console.error("Survey not found:", surveyId);
        toast.error("Survey not found");
        return;
      }

      // Perform the update
      const { data: updateData, error: updateError } = await supabase
        .from("surveys")
        .update({ is_active: newStatus })
        .eq("id", surveyId)
        .select();

      if (updateError) {
        console.error("Error updating survey status:", updateError);
        toast.error("Failed to update status");
        return;
      }

      console.log('Update successful:', updateData);

      // Update local state since the update was successful
      setSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey.id === surveyId ? { ...survey, is_active: newStatus } : survey
        )
      );
      toast.success("Survey status updated");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setUpdatingSurvey(null);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedSurveys = () => {
    if (!surveys.length) return [];
    
    return [...surveys].sort((a, b) => {
      if (sortConfig.key === 'responses') {
        const countA = a.response_count || 0;
        const countB = b.response_count || 0;
        return sortConfig.direction === 'asc' ? countA - countB : countB - countA;
      }
      
      if (sortConfig.key === 'is_active') {
        return sortConfig.direction === 'asc' 
          ? (a.is_active ? 1 : -1) - (b.is_active ? 1 : -1)
          : (b.is_active ? 1 : -1) - (a.is_active ? 1 : -1);
      }
      
      if (sortConfig.key === 'survey_title') {
        return sortConfig.direction === 'asc'
          ? a.survey_title.localeCompare(b.survey_title)
          : b.survey_title.localeCompare(a.survey_title);
      }
      
      // Default sort by created_at
      return sortConfig.direction === 'asc'
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    });
  };

  if (spacesLoading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (!selectedSpace) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-base-content/5 bg-base-100 rounded-box">
        <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto text-primary" width="64" height="64" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 11l-4 4l-1.5 -1.5" />
                <path d="M14 4l-4 4l-1.5 -1.5" />
                <path d="M20 11l-4 4l-1.5 -1.5" />
                <path d="M9 21l-4 -4" />
                <path d="M14 11l-4 4" />
                <path d="M20 21l-4 -4" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No spaces yet</h3>
        <p className="text-base-content/70 mb-6 max-w-md">Create your first space to organize your surveys.</p>
        <form onSubmit={handleCreateSpace} className="flex flex-col items-center gap-4 w-full max-w-xs">
          <input
            type="text"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            placeholder="Your new space name"
            className="input input-bordered w-full"
            disabled={isCreatingSpace}
          />
          <input
            type="text"
            value={spaceDomain}
            onChange={(e) => setSpaceDomain(e.target.value)}
            placeholder="https://your-domain.com"
            className="input input-bordered w-full"
            disabled={isCreatingSpace}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={isCreatingSpace}>
            {isCreatingSpace ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Create your first space"
            )}
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-base-content/5 bg-base-100 rounded-box">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-primary">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M9 14l2 2 4-4"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No surveys yet</h3>
        <p className="text-base-content/70 mb-6 max-w-md">Create your first survey to start collecting feedback from your customers.</p>
        <a href="/dashboard/new-survey" className="btn btn-primary">
          Create your first survey
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th 
              className="cursor-pointer hover:bg-base-200" 
              onClick={() => handleSort('is_active')}
            >
              Status {sortConfig.key === 'is_active' && (
                <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th 
              className="cursor-pointer hover:bg-base-200" 
              onClick={() => handleSort('survey_title')}
            >
              Survey Title {sortConfig.key === 'survey_title' && (
                <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th 
              className="cursor-pointer hover:bg-base-200" 
              onClick={() => handleSort('created_at')}
            >
              Created {sortConfig.key === 'created_at' && (
                <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th 
              className="cursor-pointer hover:bg-base-200" 
              onClick={() => handleSort('responses')}
            >
              Responses {sortConfig.key === 'responses' && (
                <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th>Survey Link</th>
            <th>View Responses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getSortedSurveys().map(({ id, survey_title, created_at, is_active, response_count }) => (
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
              <td>{response_count || 0}</td>
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
                  style={{
                    positionAnchor: `--anchor-${id}`, // matching style for the dropdown
                  }}
                >
                  <li>
                    <DeleteModal
                      object="survey"
                      objectID={id}
                      objectTitle={survey_title}
                      onDeleteSuccess={(deletedId) => {
                        console.log('[SurveyNav] onDeleteSuccess called with deletedId:', deletedId);
                        setSurveys((prevSurveys) => {
                          console.log('[SurveyNav] prevSurveys:', prevSurveys);
                          const newSurveys = prevSurveys.filter(
                            (survey) => survey.id !== deletedId
                          );
                          console.log('[SurveyNav] newSurveys after filter:', newSurveys);
                          return newSurveys;
                        });
                      }}
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
