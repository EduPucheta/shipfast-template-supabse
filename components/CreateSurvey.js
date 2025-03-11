"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSurvey } from "../app/context/SurveyContext";
import { toast } from "react-hot-toast";

const supabase = createClientComponentClient();

const themeOptions = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine",
  "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
  "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
];

const reactionOptions = ["Stars", "Hearts", "Emojis"];

const CreateSurvey = () => {
  const { question1, setQuestion1, surveyTheme, setSurveyTheme, reactionType, setreactionType } = useSurvey(); // Access context

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setDescription] = useState("");
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
    let finalSurveyTitle = surveyTitle.trim();
    
    if (!finalSurveyTitle) {
      // Get all surveys for the current user to determine the next number
      const { data: existingSurveys, error: fetchError } = await supabase
        .from("surveys")
        .select("survey_title")
        .eq("user_id", userId)
        .like("survey_title", "Survey-%");

      if (fetchError) {
        setError("Error fetching existing surveys");
        return;
      }

      // Find the highest number in existing survey titles
      let maxNumber = 0;
      existingSurveys?.forEach(survey => {
        const match = survey.survey_title.match(/Survey-(\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          maxNumber = Math.max(maxNumber, num);
        }
      });

      // Create new survey name with incremented number
      finalSurveyTitle = `Survey-${maxNumber + 1}`;
    }

    if (!surveyTheme || !question1.trim()) {
      setError("Survey theme and at least one question are required.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // First check if the name already exists for this user
    const { data: existingData, error: checkError } = await supabase
      .from("surveys")
      .select("survey_title")
      .eq("survey_title", finalSurveyTitle)
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      setError("Error checking survey name");
      setLoading(false);
      return;
    }

    if (existingData) {
      setError("You already have a survey with this name. Please choose a different name.");
      setLoading(false);
      return;
    }

    // If we get here, the name is unique, so we can create the survey
    const { error } = await supabase.from("surveys").insert([
      {
        survey_title: finalSurveyTitle,
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
      setSurveyTheme("cupcake");
      setreactionType("Stars");
      setQuestion1("How would you rate your experience?");
      toast.success("Survey created successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="card bg-base-200 shadow-xl min-w-[500px] ">
      <div className="card-body">
        <h2 className="text-xl font-bold text-center mb-4">Create a New Survey</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          {/* Step 1: Survey Information */}
          <details className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
            <summary className="collapse-title text-base font-medium">
              Step 1: Survey Information
            </summary>
            <div className="collapse-content">
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
              </div>
              <div className="form-control mt-2">
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
              </div>
            </div>
          </details>

          {/* Step 2: Survey Questions */}
          <details className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
            <summary className="collapse-title text-base font-medium">
              Step 2: Survey Questions
            </summary>
            <div className="collapse-content">
              <div className="form-control">
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
            </div>
          </details>

          {/* Step 3: Survey Customization */}
          <details className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
            <summary className="collapse-title text-base font-medium">
              Step 3: Survey Customization
            </summary>
            <div className="collapse-content">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Theme Picker (Required)</span>
                </label>
                <select
                  className="select select-bordered"
                  value={surveyTheme}
                  onChange={(e) => setSurveyTheme(e.target.value)}
                  required
                >
                  <option value="cupcake" selected>
                    cupcake
                  </option>
                  {themeOptions.map((theme) => (
                    theme !== "cupcake" && (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    )
                  ))}
                </select>
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Reaction Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={reactionType}
                  onChange={(e) => setreactionType(e.target.value)}
                  required
                >
                  <option value="Stars" selected>
                    Stars
                  </option>
                  {reactionOptions.map((reaction) => (
                    reaction !== "Stars" && (
                      <option key={reaction} value={reaction}>
                        {reaction}
                      </option>
                    )
                  ))}
                </select>
              </div>
            </div>
          </details>
        </div>

        {/* Submission Button */}
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
