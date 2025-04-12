"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSurvey } from "../app/context/SurveyContext";
import { Smartphone } from "lucide-react";
import { Monitor } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { X } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PreviewSurvey = ({ isPreview, surveyID }) => {
  const { question1, surveyTheme, reactionType } = useSurvey();
  const [surveyData, setSurveyData] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [previewMode, setPreviewMode] = useState("smartphone");
  const [isDeviceAllowed, setIsDeviceAllowed] = useState(true);

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
      if (!isPreview && surveyID) {
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
        } else if (data && data.target_devices?.[deviceType]) {
          console.log('Device type is allowed for this survey');
          setSurveyData(data);
        } else {
          console.log('Device type is not allowed for this survey');
          setSurveyData(null);
        }
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [isPreview, surveyID]);

  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
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

    // Get the current page URL
    const pageUrl = window.location.href;

    const { error: submitError } = await supabase
      .from("reviews")
      .insert([{ 
        rating, 
        review, 
        survey: surveyID,
        page: pageUrl 
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
  }, [rating, review, surveyID]);

  const displayQuestion = isPreview ? question1 : surveyData?.question1;
  const displayTheme = isPreview ? surveyTheme : surveyData?.survey_theme;
  const displayReaction = isPreview ? reactionType : surveyData?.reactionType;

  const innerContent = (
    <div
      data-theme={displayTheme}
      className="card !bg-base-200 w-[320px] m-4  shrink-0 p-8 flex flex-col justify-center items-center gap-4 max-w-[400px] "  
    >
      {loading ? (
        <div className="flex justify-center items-center mt-5">
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
            <div className="text-center p-4">
              <h3 className="text-lg font-semibold">Thank You!</h3>
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
                    className="rating rating-lg"
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
                  <div className="flex gap-4" role="radiogroup" aria-label="Rating">
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
                className="textarea textarea-md"
                value={review}
                onChange={handleReviewChange}
                aria-label="Review comment"
              ></textarea>

              <div className="form-control mt-6">
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

  if (!isDeviceAllowed) {
    return null;
  }

  return (
    <div className=" " data-theme="" >
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="btn btn-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Feedback2</span>
        </button>
      ) : (
        <div  className="relative">
          <div className="flex flex-col items-center justify-center  ">


            {isPreview ? (
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
            ) : (
              ""
            )}

            {isPreview ? (
              <div className="overflow-auto border border-base-300 rounded-lg">
                <div className="flex flex-col justify-center items-center">
                  <div
                    className={`${
                      previewMode === 'smartphone'
                        ? 'w-[340px] h-[568px] flex flex-col justify-center items-center'
                        : 'w-[600px] h-[400px] flex flex-col justify-center items-center'
                    } transition-all duration-300 bg-white`}
                  >
                    {innerContent}
                  </div>
                </div>
              </div>
            ) : (
              innerContent
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSurvey;
