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
  // Using defaults from context or initial values
  const { question1, setQuestion1, surveyTheme, setSurveyTheme, reactionType, setreactionType } = useSurvey();

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
          const { data, error: authError } = await supabase.auth.getUser();
          if (authError) throw authError;
          setUserId(data.user?.id || null);
      } catch (authError) {
          setError("Could not fetch user information: " + authError.message);
          console.error("Authentication Error:", authError);
      }
    };

    getUser();
  }, []);

  const handleCreateSurvey = async () => {
    setError(null); // Clear previous errors
    // --- Validation --- 
    if (!userId) {
        setError("User information not available. Please refresh or log in again.");
        return;
    }
    if (!question1.trim()) {
        setError("Question 1 is required.");
        // Optionally focus the input or expand the section
        document.getElementById('question1-input')?.focus();
        return;
    }
    if (!surveyTheme) {
        setError("Survey theme is required.");
        // Optionally focus the select or expand the section
        document.getElementById('theme-select')?.focus();
        return;
    }
     if (!reactionType) {
        setError("Reaction type is required.");
        // Optionally focus the select or expand the section
        document.getElementById('reaction-select')?.focus();
        return;
    }

    setLoading(true);
    let finalSurveyTitle = surveyTitle.trim();

    // --- Auto-Naming Logic --- 
    if (!finalSurveyTitle) {
      try {
          const { data: existingSurveys, error: fetchError } = await supabase
              .from("surveys")
              .select("survey_title")
              .eq("user_id", userId)
              .like("survey_title", "Survey-%");

          if (fetchError) throw fetchError;

          let maxNumber = 0;
          existingSurveys?.forEach(survey => {
              const match = survey.survey_title.match(/Survey-(\d+)/);
              if (match) {
                  maxNumber = Math.max(maxNumber, parseInt(match[1]));
              }
          });
          finalSurveyTitle = `Survey-${maxNumber + 1}`;
          // Don't set state here, only use the final name for insertion
      } catch (fetchError) {
           setError("Error generating survey name: " + fetchError.message);
           setLoading(false);
           return;
      }
    }

    // --- Check for Existing Name --- 
    try {
        const { data: existingData, error: checkError } = await supabase
            .from("surveys")
            .select("survey_title")
            .eq("survey_title", finalSurveyTitle)
            .eq("user_id", userId)
            .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without error

        if (checkError) throw checkError;

        if (existingData) {
            setError(`You already have a survey named "${finalSurveyTitle}". Please choose a different name.`);
            document.getElementById('survey-title-input')?.focus();
            setLoading(false);
            return;
        }
    } catch (checkError) {
        setError("Error checking for existing survey name: " + checkError.message);
        setLoading(false);
        return;
    }

    // --- Create Survey --- 
    try {
        const { data: insertData, error: insertError } = await supabase
            .from("surveys")
            .insert([
                {
                    survey_title: finalSurveyTitle,
                    survey_description: surveyDescription,
                    survey_theme: surveyTheme,
                    reactionType: reactionType,
                    question1: question1,
                    user_id: userId,
                },
            ])
            .select()
            .single();

        if (insertError) throw insertError;

        if (insertData) {
            // Reset form fields to defaults (context or initial)
            setSurveyTitle("");
            setDescription("");
            // Optionally reset context values if needed, depends on desired behavior
            // setSurveyTheme('cupcake'); 
            // setreactionType('Stars');
            // setQuestion1('How would you rate your experience?');
            toast.success(`Survey "${finalSurveyTitle}" created successfully!`);

            // Send email (consider moving this server-side for reliability)
            fetch("/api/send", { method: "POST" })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(data => console.log("Email API response:", data))
                .catch(err => console.error("Error sending email:", err));

        } else {
             setError("Survey creation failed unexpectedly. Please try again.");
        }

    } catch (insertError) {
         setError("Failed to create survey: " + insertError.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-2xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl justify-center mb-6">Create a New Survey</h2>

        {/* Error Alert */}
        {error && (
          <div role="alert" className="alert alert-error mb-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span><strong>Error:</strong> {error}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Section 1: Survey Information */}
          <div className="collapse collapse-arrow bg-base-200 rounded-box shadow-sm">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-lg font-medium peer-checked:bg-base-300 peer-checked:text-base-content">
               Information
            </div>
            <div className="collapse-content bg-base-100 text-base-content peer-checked:bg-base-100">
              <div className="pt-4">
                  <div className="form-control">
                      <label className="label">
                      <span className="label-text">Name (Internal)</span>
                       <span className="label-text-alt">Leave blank for auto-name</span>
                      </label>
                      <input
                        id="survey-title-input"
                        type="text"
                        placeholder="e.g., Q3 Customer Feedback"
                        className="input input-bordered w-full"
                        value={surveyTitle}
                        onChange={(e) => setSurveyTitle(e.target.value)}
                      />
                  </div>
                  <div className="form-control mt-3">
                      <label className="label">
                      <span className="label-text">Description (Internal, Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Briefly describe the survey's purpose"
                        className="input input-bordered w-full"
                        value={surveyDescription}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                  </div>
              </div>
            </div>
          </div>

          {/* Section 2: Survey Questions */}
           <div className="collapse collapse-arrow bg-base-200 rounded-box shadow-sm">
            <input type="checkbox" className="peer" defaultChecked /> {/* Start open */}
            <div className="collapse-title text-lg font-medium peer-checked:bg-base-300 peer-checked:text-base-content">
              Questions
            </div>
            <div className="collapse-content bg-base-100 text-base-content peer-checked:bg-base-100">
              <div className="pt-4">
                  <div className="form-control">
                      <label className="label">
                      <span className="label-text font-semibold">Question 1</span>
                      
                      </label>
                      <input
                        id="question1-input"
                        type="text"
                        className="input input-bordered w-full"
                        value={question1} // Use context value
                        onChange={(e) => setQuestion1(e.target.value)} // Update context value
                        required
                      />
                       <label className="label">
                          <span className="label-text-alt">This is the main question customers will see.</span>
                      </label>
                  </div>
                   {/* Placeholder for future questions */}
              </div>
            </div>
          </div>

          {/* Section 3: Survey Customization */}
          <div className="collapse collapse-arrow bg-base-200 rounded-box shadow-sm">
            <input type="checkbox" className="peer" defaultChecked /> {/* Start open */}
            <div className="collapse-title text-lg font-medium peer-checked:bg-base-300 peer-checked:text-base-content">
               Customization
            </div>
            <div className="collapse-content bg-base-100 text-base-content peer-checked:bg-base-100">
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="form-control">
                     <label className="label">
                         <span className="label-text font-semibold">Theme</span>
                        
                     </label>
                     <select
                         id="theme-select"
                         className="select select-bordered w-full"
                         value={surveyTheme} // Use context value
                         onChange={(e) => setSurveyTheme(e.target.value)} // Update context value
                         required
                     >
                         {themeOptions.map((theme) => (
                             <option key={theme} value={theme}>
                                 {theme.charAt(0).toUpperCase() + theme.slice(1)} {/* Capitalize for display */}
                             </option>
                         ))}
                     </select>
                     <label className="label">
                          <span className="label-text-alt">Controls the visual style.</span>
                      </label>
                 </div>
                 <div className="form-control">
                      <label className="label">
                          <span className="label-text font-semibold">Reaction Type</span>
                        
                      </label>
                     <select
                         id="reaction-select"
                         className="select select-bordered w-full"
                         value={reactionType} // Use context value
                         onChange={(e) => setreactionType(e.target.value)} // Update context value
                         required
                     >
                         {reactionOptions.map((reaction) => (
                             <option key={reaction} value={reaction}>
                                 {reaction}
                             </option>
                         ))}
                     </select>
                     <label className="label">
                          <span className="label-text-alt">How users rate.</span>
                      </label>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Button */}
        <div className="card-actions justify-end mt-6">
          <button
            className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
            onClick={handleCreateSurvey}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Creating...
              </>
            ) : "Create Survey"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
