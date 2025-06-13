"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSurvey } from "../app/context/SurveyContext";
import { Smartphone } from "lucide-react";
import { Monitor } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PreviewSurvey = ({ isPreview, surveyID, showDeviceToggles, pageUrl }) => {
  const { question1, surveyTheme, reactionType } = useSurvey();
  const [surveyData, setSurveyData] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [previewMode, setPreviewMode] = useState("smartphone");

  // Function to detect device type
  const detectDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  useEffect(() => {
    // Notify parent window that widget is ready
    if (window.parent !== window) {
      window.parent.postMessage({ type: "widget-ready" }, "*");
    }
  }, []);

  useEffect(() => {
    const fetchSurvey = async () => {
      if (surveyID) {
        setLoading(true);
        
        // Detect device type
        const width = window.innerWidth;
        const deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
        console.log('Current device type:', deviceType, 'Window width:', width);
        
        const { data, error } = await supabase
          .from("surveys")
          .select("question1, survey_theme, reactionType, target_devices")
          .eq("id", surveyID)
          .eq("is_active", true)
          .single();

        console.log('Survey data:', data);
        console.log('Target devices from survey:', data?.target_devices);
        
        if (error) {
          console.error("Error fetching survey data:", error);
          setSurveyData(null);
        } else if (data) {
          console.log('Survey data fetched successfully');
          setSurveyData(data);
          if (!data.target_devices?.[deviceType]) {
            console.log('Device type is not allowed for this survey, but showing content anyway.');
          }
        } else {
          console.log('No survey data found.');
          setSurveyData(null);
        }
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyID]);

  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        // setShowThankYou(false); // No longer making it invisible, just reset for potential re-interaction if parent allows
      }, 3000); // Duration of thank you message
      return () => clearTimeout(timer);
    }
  }, [showThankYou]);

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

    // Get the parent page URL from the referrer
    const pageUrlToSubmit = pageUrl || document.referrer;

    console.log('Page URL:', pageUrlToSubmit);

    const { error: submitError } = await supabase
      .from("reviews")
      .insert([{ 
        rating, 
        review, 
        survey: surveyID,
        page: pageUrlToSubmit 
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
  }, [rating, review, surveyID, pageUrl]);

  const displayQuestion = isPreview ? question1 : surveyData?.question1;
  const displayTheme = isPreview ? surveyTheme : surveyData?.survey_theme;
  const displayReaction = isPreview ? reactionType : surveyData?.reactionType;

  const innerContent = (
    <div
      data-theme={displayTheme}
      className="card !bg-base-200  shrink-0 p-4 flex flex-col justify-center items-center gap-4 w-full h-full shadow-lg"  
    >
      {loading ? (
        <div className="flex justify-center items-center py-4 ">
          <span className="loading loading-spinner loading-md"></span>
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
              <h3 className="text-lg font-semibold mb-1">Thank You!</h3>
              <p>Your feedback has been submitted.</p>
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
                    onChange={handleRatingChange}
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
                      />
                    ))}
                  </div>
                )}
                {displayReaction === "Hearts" && (
                  <div
                    className="rating rating-lg gap-1"
                    onChange={handleRatingChange}
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
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </>
          )}
        </>
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
        <div role="tablist" className="tabs tabs-box mb-4 tabs-sm">
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
