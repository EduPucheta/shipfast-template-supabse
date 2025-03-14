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

const PreviewSurvey = ({ isPreview, surveyID }) => {
  const { question1, surveyTheme, reactionType } = useSurvey();
  const [surveyData, setSurveyData] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("surveyID", surveyID);

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!isPreview && surveyID) {
        setLoading(true);
        const { data, error } = await supabase
          .from("surveys")
          .select("question1, survey_theme, reactionType")
          .eq("id", surveyID)
          .single();

        if (error) {
          console.error("Error fetching survey data:", error);
        } else {
          setSurveyData(data);
        }
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [isPreview, surveyID]);

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

    const { error: submitError } = await supabase
      .from("reviews")
      .insert([{ rating, review, survey: surveyID }]);

    if (submitError) {
      console.error("Error submitting review:", submitError);
      setError("Failed to submit review. Please try again.");
    } else {
      setRating(null);
      setReview("");
    }
    setIsSubmitting(false);
  }, [rating, review, surveyID]);

  const displayQuestion = isPreview ? question1 : surveyData?.question1;
  const displayTheme = isPreview ? surveyTheme : surveyData?.survey_theme;
  const displayReaction = isPreview ? reactionType : surveyData?.reactionType;

  const innerContent = (
    <div
      data-theme={displayTheme}
      className="card bg-base-200 w-full max-w-sm shrink-0 shadow-xl p-8 flex flex-col justify-center items-center gap-4"
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
          <div className="form-control flex flex-col justify-center items-center gap-4">
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
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-center mb-4">
        {isPreview ? "Preview" : ""}
      </h2>
      {isPreview ?  
      <div role="tablist" className="tabs tabs-box">
        <a role="tab" className="tab tab-active">
        <Smartphone />
        </a>
        <a role="tab" className="tab ">

         <Monitor />
        </a>

      </div>
      : ""}

      {isPreview ? (
        <div className="mockup-phone">
          <div className="mockup-phone-camera"></div>
          <div className="mockup-phone-display flex flex-col justify-center items-center">
            <div className="w-[320px] h-[568px]">{innerContent}</div>
          </div>
        </div>
      ) : (
        innerContent
      )}
    </div>
  );
};

export default PreviewSurvey;
