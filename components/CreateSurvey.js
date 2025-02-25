"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const themeOptions = ["Cupcake", "Light", "Dark"];
const reactionOptions = ["Stars", "Hearts", "Emojis"];

const CreateSurvey = ({ question1, setQuestion1 }) => {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setDescription] = useState("");
  const [surveyTheme, setSurveyTheme] = useState("");
  const [reactionType, setreactionType] = useState("");
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
    if (!surveyTitle.trim() || !surveyTheme || !question1.trim()) {
      setError("Survey title, theme, and at least one question are required.");
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("surveys").insert([
      {
        survey_title: surveyTitle,
        survey_description: surveyDescription,
        survey_theme: surveyTheme,
        reactionType: reactionType,
        question1: question1,
        user_id: userId,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setSurveyTitle("");
      setDescription("");
      setSurveyTheme("");
      setreactionType("");
      setQuestion1("How would you rate your experience?"); // Reset to default or empty string as needed
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
            <span className="label-text">Theme Picker (Required)</span>
          </label>
          <select
            className="select select-bordered"
            value={surveyTheme}
            onChange={(e) => setSurveyTheme(e.target.value)}
            required
          >
            <option value="" disabled>Select a theme</option>
            {themeOptions.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
          <label className="label">
            <span className="label-text">Reaction Type</span>
          </label>
          <select
            className="select select-bordered"
            value={reactionType}
            onChange={(e) => setreactionType(e.target.value)}
            required
          >
            <option value="" disabled>Select a reaction type</option>
            {reactionOptions.map((reaction) => (
              <option key={reaction} value={reaction}>{reaction}</option>
            ))}
          </select>
          <label className="label">
            <span className="label-text">Question 1 (Required)</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={question1}
            onChange={(e) => setQuestion1(e.target.value)}
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
