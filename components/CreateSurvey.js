"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const CreateSurvey = () => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setDescription] = useState("");
  const [surveyCategory, setSurveyCategory] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };

    getUser();
  }, []);

  const handleCreateSurvey = async () => {
    if (!surveyTitle.trim() || !surveyCategory.trim()) {
      setError("Survey title and category are required.");
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("surveys").insert([
      {
        survey_title: surveyTitle,
        survey_description: surveyDescription,
        survey_category: surveyCategory,
        target_audience: targetAudience,
        expiration_date: expirationDate,
        user_id: userId,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setSurveyTitle("");
      setDescription("");
      setSurveyCategory("");
      setTargetAudience("");
      setExpirationDate("");
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
            <span className="label-text">Name (Internal)</span>
          </label>
          <input
            type="text"
            placeholder="Enter survey name"
            className="input input-bordered"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            required
          />
          <label className="label">
            <span className="label-text">Description (Internal)</span>
          </label>
          <input
            type="text"
            placeholder="Enter survey description"
            className="input input-bordered"
            value={surveyDescription}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="label">
            <span className="label-text">Category (Required)</span>
          </label>
          <input
            type="text"
            placeholder="Enter survey category"
            className="input input-bordered"
            value={surveyCategory}
            onChange={(e) => setSurveyCategory(e.target.value)}
            required
          />
          <label className="label">
            <span className="label-text">Target Audience</span>
          </label>
          <input
            type="text"
            placeholder="Enter target audience"
            className="input input-bordered"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
          <label className="label">
            <span className="label-text">Expiration Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
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
