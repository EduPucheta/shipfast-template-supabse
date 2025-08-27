"use client";
import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSurvey } from "../app/context/SurveyContext";
import { Smartphone, Monitor, RefreshCcw } from "lucide-react";
import { detectBrowserName } from "../libs/browser-detector";

const PreviewSurvey = ({ isPreview, surveyID, showDeviceToggles, pageUrl, browser, deviceType: propDeviceType, country: propCountry }) => {
  const supabase = createClientComponentClient();
  const { question1, surveyTheme, reactionType, submitButtonText, thankYouTitle, thankYouText } = useSurvey();
  const [surveyData, setSurveyData] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [previewMode, setPreviewMode] = useState("smartphone");
  const [isMounted, setIsMounted] = useState(false);
    const [showBranding, setShowBranding] = useState(true);

  // Function to detect device type (only call after mounting)
  const detectDeviceType = () => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Notify parent window that widget is ready (only after mounting)
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ type: "widget-ready" }, "*");
    }
  }, []);

  useEffect(() => {
    const checkUserPlan = async () => {
      console.log("Checking user plan...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }
      if (user) {
        console.log("User found:", user);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
        if (profile) {
          console.log("Profile found:", profile);
          if (profile.plan !== 'Free') {
            console.log("User has a paid plan. Hiding branding.");
            setShowBranding(false);
          } else {
            console.log("User has a Free plan. Showing branding.");
          }
        } else {
          console.log("No profile found for the user.");
        }
      } else {
        console.log("No user is logged in.");
      }
    };

    checkUserPlan();
  }, [supabase]);

  useEffect(() => {
    if (!isMounted) return;
    
    const fetchSurvey = async () => {
      if (surveyID) {
        setLoading(true);
        
        // Use passed device type or detect if not provided
        const deviceType = propDeviceType || detectDeviceType();
        console.log('Preview device type:', deviceType, propDeviceType ? '(from prop)' : '(detected)', 'Window width:', typeof window !== 'undefined' ? window.innerWidth : 'N/A');
        
        const { data, error } = await supabase
          .from("surveys")
          .select(
            "*, survey_devices(*)"
          )
          .eq("id", surveyID)
          .eq("is_active", true)
          .single();

        console.log('Survey data:', data);
        if (error) {
          console.error("Error fetching survey data:", error);
          setSurveyData(null);
        } else if (data) {
          console.log('Survey data fetched successfully');
          const allowedDevices = data.survey_devices.map(d => d.device_name);
          
          // Check if current device is allowed for this survey
          if (!allowedDevices.includes(deviceType)) {
            console.log(`Device type '${deviceType}' is not allowed for this survey. Allowed devices:`, allowedDevices);
            setSurveyData(null);
            setError(`This survey is not available for ${deviceType} devices`);
          } else {
            console.log(`Device type '${deviceType}' is allowed for this survey`);
            setSurveyData(data);
            setError(null);
          }
        } else {
          console.log('No survey data found.');
          setSurveyData(null);
        }
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyID, isMounted, supabase, propDeviceType]);

  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        // setShowThankYou(false); // No longer making it invisible, just reset for potential re-interaction if parent allows
      }, 3000); // Duration of thank you message
      return () => clearTimeout(timer);
    }
  }, [showThankYou]);

  const handleReset = useCallback(() => {
    setRating(null);
    setReview("");
    setShowThankYou(false);
    setError(null);
  }, []);

  const handleRatingChange = useCallback((e) => {
    setRating(e.target.value);
  }, []);

  const handleReviewChange = useCallback((e) => {
    setReview(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Get the parent page URL from the referrer (safely after mounting)
    const pageUrlToSubmit = pageUrl || (typeof document !== 'undefined' ? document.referrer : '');
    const browserToSubmit = browser || (typeof navigator !== 'undefined' ? detectBrowserName(navigator.userAgent) : 'Unknown');
    const countryToSubmit = propCountry || 'Unknown';

    console.log('Page URL:', pageUrlToSubmit);
    console.log('Country:', countryToSubmit);

    const { error: submitError } = await supabase
      .from("reviews")
      .insert([{ 
        rating, 
        review, 
        survey: surveyID,
        page: pageUrlToSubmit,
        browser: browserToSubmit,
        device: propDeviceType,
        country: countryToSubmit,
      }]); 

    if (submitError) {
      console.error("Error submitting review:", submitError);
      setError("Failed to submit review. Please try again.");
    } else {
      setRating(null);
      setReview("");
      setShowThankYou(true);
    }
    setIsSubmitting(false);
  }, [rating, review, surveyID, pageUrl, browser, supabase, propDeviceType, propCountry]);

  const displayQuestion = isPreview ? question1 : surveyData?.question1;
  const displayTheme = isPreview ? surveyTheme : surveyData?.survey_theme;
  const displayReaction = isPreview ? reactionType : surveyData?.reactionType;
  const displaySubmitButtonText = isPreview ? submitButtonText : (surveyData?.submit_button_text || "Submit");
  const displayThankYouTitle = isPreview ? thankYouTitle : (surveyData?.thank_you_title || "Thank You!");
  const displayThankYouText = isPreview ? thankYouText : (surveyData?.thank_you_text || "Your feedback has been submitted.");

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="card !bg-base-200 shrink-0 p-4 flex flex-col justify-center items-center gap-4 w-full h-full shadow-lg" suppressHydrationWarning={true}>
        <div className="flex justify-center items-center py-4">
          {/* Loading spinner disabled */}
        </div>
      </div>
    );
  }

  const innerContent = (
    <div
      data-theme={displayTheme}
      className="card shrink-0 p-4 flex flex-col justify-center items-center gap-4 w-full h-full "
      suppressHydrationWarning={true}
    >
      {loading ? (
        <div className="flex justify-center items-center py-4 ">
          {/* Loading spinner disabled */}
        </div>
      ) : (
        <>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          {showThankYou ? (
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold mb-1">{displayThankYouTitle}</h3>
              <p>{displayThankYouText}</p>
            </div>
          ) : (
            <>
              <div className="form-control flex flex-col justify-center items-center gap-4 ">
                <label className="label">
                  <span className="label-text">{displayQuestion}</span>
                </label>
                {displayReaction === "Stars" && (
                  <div
                    className="rating rating-lg gap-1"
                    role="radiogroup"
                    aria-label="Rating"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <input
                        key={value}
                        type="radio"
                        name="rating-2"
                        value={value}
                        className="mask mask-star-2"
                        aria-label={`${value} stars`}
                        checked={rating === value.toString()}
                        onChange={handleRatingChange}
                      />
                    ))}
                  </div>
                )}
                {displayReaction === "Hearts" && (
                  <div
                    className="rating rating-lg gap-1"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <input
                        key={value}
                        type="radio"
                        name="rating-3"
                        value={value}
                        className={`mask mask-heart bg-${
                          ["red", "orange", "yellow", "lime", "green"][value - 1]
                        }-400`}
                        checked={rating === value.toString()}
                        onChange={handleRatingChange}
                      />
                    ))}
                  </div>
                )}
                {displayReaction === "Emojis" && (
                  <div className="flex gap-2" role="radiogroup" aria-label="Rating">
                    {["😡", "😠", "😐", "😊", "😍"].map((emoji, index) => (
                      <label key={index} className="cursor-pointer flex flex-col items-center">
                        <input
                          type="radio"
                          name="emoji-rating"
                          value={index + 1}
                          checked={rating === (index + 1).toString()}
                          onChange={handleRatingChange}
                          className="sr-only"
                        />
                        <span className={`text-3xl transition-all duration-200 hover:scale-110 hover:opacity-100 ${
                          rating ? (rating === (index + 1).toString() ? 'transform scale-125 opacity-100' : 'opacity-40') : 'opacity-100'
                        }`}>
                          {emoji}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                placeholder="Leave us a comment"
                className="textarea textarea-md mt-2"
                value={review}
                onChange={handleReviewChange}
                aria-label="Review comment"
              ></textarea>

              <div className="form-control mt-4">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    displaySubmitButtonText
                  )}
                </button>
              </div>
            </>
          )}
        </>
      )}
      
      {/* Feedbackito branding */}
      {showBranding && (
        <div className="mt-4 pt-2 border-t border-base-300">
          <a
            href="https://feedbackito.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-base-content/60 hover:text-base-content/80 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            Powered by <span className="font-semibold">Feedbackito</span>
          </a>
        </div>
      )}

    </div>
  );

  const SizedAndStyledContent = (
    <div
      className={`${
        showDeviceToggles
          ? (previewMode === 'smartphone'
              ? 'w-[340px] h-[568px]'
              : 'w-[600px] h-[400px]')
          : 'w-full h-full ' // No fixed w/h if not showing device toggles; innerContent is w-full h-full
      } flex flex-col justify-center items-center gap-2 transition-all duration-300 bg-white `}
    >
      {innerContent}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {showDeviceToggles && (
        <div className="flex items-center gap-2 mb-4">
          <div role="tablist" className="tabs tabs-box tabs-sm">
            <a
              role="tab"
              className={`tab ${previewMode === 'smartphone' ? 'tab-active' : ''}`}
              onClick={() => setPreviewMode('smartphone')}
            >
              <Smartphone className="w-4 h-4" />
            </a>
            <a
              role="tab"
              className={`tab ${previewMode === 'monitor' ? 'tab-active' : ''}`}
              onClick={() => setPreviewMode('monitor')}
            >
              <Monitor className="w-4 h-4" />
            </a>
          </div>
          <div className="tooltip" data-tip="Reset widget to initial state">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleReset}
              aria-label="Reset widget to initial state"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isPreview ? (
        <div className="overflow-auto border border-base-300 rounded-lg p-2">
          {SizedAndStyledContent}
        </div>
      ) : (
        SizedAndStyledContent
      )}
    </div>
  );
};

export default PreviewSurvey;
