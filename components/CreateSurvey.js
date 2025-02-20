"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const CreateSurvey = () => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      console.log(data.user);

      setUserId(data.user.id);
    };

    getUser();
  }, [supabase]);

  const handleCreateSurvey = async () => {
    if (!surveyTitle.trim()) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("surveys")
      .insert([{ survey_title: surveyTitle, user_id: userId }]);

    if (error) {
      setError(error.message);
    } else {
      setSurveyTitle("");
      alert("Survey created successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="card bg-base-200 w-full max-w-sm shrink-0 shadow-xl">
      <div className="card-body">
        <h2 className="text-xl font-bold text-center">Create a New Survey</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Survey Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter survey name"
            className="input input-bordered"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-control mt-6">
          <button
            className="btn btn-primary"
            onClick={handleCreateSurvey}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Survey"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
