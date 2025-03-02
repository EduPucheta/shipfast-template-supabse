"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSurvey } from "../app/context/SurveyContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PreviewSurvey = ({ isPreview, surveyID }) => {
  const { question1, surveyTheme, reactionType } = useSurvey();
  const [surveyData, setSurveyData] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");

  console.log("surveyID", surveyID);

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!isPreview && surveyID) {
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
      }
    };

    fetchSurvey();
  }, [isPreview, surveyID]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      { rating, review, survey: surveyID },
    ]);

    if (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    } else {
      alert("Review submitted successfully");
      setRating(null);
      setReview("");
    }
  };

  const displayQuestion = isPreview ? question1 : surveyData?.question1;
  const displayTheme = isPreview ? surveyTheme : surveyData?.survey_theme;
  const displayReaction = isPreview ? reactionType : surveyData?.reactionType;

  const innerContent = (
    <div
      data-theme={displayTheme}
      className="card bg-base-200 w-full max-w-sm shrink-0 shadow-xl p-8 flex flex-col justify-center items-center gap-4"
    >
      <div className="form-control flex flex-col justify-center items-center gap-4">
        <label className="label">
          <span className="label-text">{displayQuestion}</span>
        </label>
        {displayReaction === "Stars" && (
          <div className="rating rating-lg" onChange={handleRatingChange}>
            {[1, 2, 3, 4, 5].map((value) => (
              <input
                key={value}
                type="radio"
                name="rating-2"
                value={value}
                className="mask mask-star-2"
              />
            ))}
          </div>
        )}
        {displayReaction === "Hearts" && (
          <div className="rating rating-lg gap-1" onChange={handleRatingChange}>
            {[1, 2, 3, 4, 5].map((value) => (
              <input
                key={value}
                type="radio"
                name="rating-3"
                value={value}
                className={`mask mask-heart bg-${["red", "orange", "yellow", "lime", "green"][value - 1]}-400`}
              />
            ))}
          </div>
        )}
      </div>

      <textarea
        placeholder="Leave us a comment"
        className="textarea textarea-md"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      ></textarea>

      <div className="form-control mt-6">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-center mb-4">
        {isPreview ? "Preview" : ""}
      </h2>

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
