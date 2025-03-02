"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FeedbackWidget = ({ projectId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!projectId) return;
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) console.error("Error fetching survey:", error);
      else setSurveyData(data);
    };

    if (isOpen) fetchSurvey();
  }, [isOpen, projectId]);

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      { rating, review, project_id: projectId },
    ]);

    if (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    } else {
      alert("Review submitted successfully");
      setRating(null);
      setReview("");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 15px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Give Feedback
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <h3>Submit Feedback!</h3>
            <p>{surveyData?.question1}</p>

            {/* Rating Input */}
            <div>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRating(val)}
                  style={{
                    margin: "5px",
                    background: rating === val ? "gold" : "#ccc",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>

            {/* Comment Input */}
            <textarea
              placeholder="Leave a comment"
              style={{ width: "100%", height: "100px", marginTop: "10px" }}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>

            <div style={{ marginTop: "10px" }}>
              <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
                Submit
              </button>
              <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Make the component globally accessible
window.FeedbackWidgetComponent = FeedbackWidget;
