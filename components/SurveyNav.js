"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const SurveyNav = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      console.log(data.user);
     
      setUserId(data.user.id);
    };

    getUser();
  }, [supabase]);

  useEffect(() => {
    console.log(userId);

    if (!userId) return; // Wait until userId is set

    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("surveys")
          .select("survey_title")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching reviews:", error);
        } else {
          // Extract and deduplicate survey titles
          const uniqueSurveys = Array.from(
            new Set(data.map((review) => review.survey_title))
          );
          setReviews(uniqueSurveys);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-28 justify-center h-20 w-80 items-center mt-5">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4  rounded-box ">
      {reviews.map((title) => (
        <li key={title}>
          <a >{title}</a>
        </li>
      ))}
    </ul>
  );
};

export default SurveyNav;
