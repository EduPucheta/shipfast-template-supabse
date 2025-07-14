"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSurvey } from "../app/context/SurveyContext";
import { useSpace } from "@/app/context/SpaceContext";
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
  const { selectedSpace } = useSpace();

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setDescription] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [userId, setUserId] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState({
    desktop: true,
    tablet: true,
    mobile: true
  });
  const [targetingType, setTargetingType] = useState('all_pages'); // 'all_pages' or 'specific_pages'
  const [targetUrls, setTargetUrls] = useState(['']); // Array of URLs/triggers

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
    if (!selectedSpace) {
        setError("No space selected. Please select or create a space first.");
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

    // Add validation for devices
    if (!selectedDevices.desktop && !selectedDevices.tablet && !selectedDevices.mobile) {
        setError("Please select at least one device type.");
        return;
    }

    // Add validation for specific pages if that option is selected
    if (targetingType === 'specific_pages' && (!targetUrls.length || !targetUrls[0])) {
        setError("Please specify at least one URL or trigger.");
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
                    space_id: selectedSpace.id,
                    target_devices: selectedDevices,
                    targeting_type: targetingType,
                    target_urls: targetingType === 'specific_pages' ? targetUrls : null,
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
    <div className="card bg-base-100 w-full max-w-3xl mx-auto">
      <div className="card-body pt-0">
        <h2 className="card-title text-xl justify-center mb-6">Create new survey</h2>

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

          {/* Section 4: Survey Targeting */}
          <div className="collapse collapse-arrow bg-base-200 rounded-box shadow-sm">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-lg font-medium peer-checked:bg-base-300 peer-checked:text-base-content">
              Targeting
            </div>
            <div className="collapse-content bg-base-100 text-base-content peer-checked:bg-base-100">
              <div className="pt-4 space-y-6">
                {/* Devices Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Devices <span className="text-error">*</span></span>
                  </label>
                  <p className="text-sm text-base-content/70 mb-2">Select which devices to show this survey on</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedDevices.desktop}
                        onChange={(e) => setSelectedDevices(prev => ({ ...prev, desktop: e.target.checked }))}
                      />
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        Desktop
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedDevices.tablet}
                        onChange={(e) => setSelectedDevices(prev => ({ ...prev, tablet: e.target.checked }))}
                      />
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="4" y="2" width="16" height="20" rx="2" />
                          <line x1="12" y1="18" x2="12" y2="18" />
                        </svg>
                        Tablet
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedDevices.mobile}
                        onChange={(e) => setSelectedDevices(prev => ({ ...prev, mobile: e.target.checked }))}
                      />
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="2" width="14" height="20" rx="2" />
                          <circle cx="12" cy="18" r="1" />
                        </svg>
                        Mobile
                      </span>
                    </label>
                  </div>
                </div>

                {/* Pages or Events Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Pages or events <span className="text-error">*</span></span>
                  </label>
                  <p className="text-sm text-base-content/70 mb-2">Select which pages or events to show this survey on</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="targeting-type"
                        className="radio"
                        checked={targetingType === 'all_pages'}
                        onChange={() => setTargetingType('all_pages')}
                      />
                      <span>All pages</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="targeting-type"
                        className="radio"
                        checked={targetingType === 'specific_pages'}
                        onChange={() => setTargetingType('specific_pages')}
                      />
                      <span>Specific pages or events</span>
                    </label>
                  </div>

                  {targetingType === 'specific_pages' && (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm font-medium">Show the survey on the following URLs or triggers:</p>
                      <p className="text-xs text-base-content/70">Fields are case-sensitive and events always take priority over URLs.</p>
                      
                      {targetUrls.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <select className="select select-bordered flex-none w-40">
                            <option>Simple URL match</option>
                            <option>Exact URL match</option>
                            <option>Regular expression</option>
                            <option>Event trigger</option>
                          </select>
                          <input
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="e.g. https://www.example.com/"
                            value={url}
                            onChange={(e) => {
                              const newUrls = [...targetUrls];
                              newUrls[index] = e.target.value;
                              setTargetUrls(newUrls);
                            }}
                          />
                          {index === targetUrls.length - 1 ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => setTargetUrls([...targetUrls, ''])}
                            >
                              Add another
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                const newUrls = targetUrls.filter((_, i) => i !== index);
                                setTargetUrls(newUrls);
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
