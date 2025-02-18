"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const Table = () => {
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
          .from("reviews")
          .select("*")
          .eq("user_id", userId);
        if (error) {
          console.error("Error fetching reviews:", error);
        } else {
          setReviews(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  const ratings = reviews.map((review) => review.rating);
  const averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);

  if (loading) {
    return (
      <div className="flex h-full w-full justify-center items-center mt-5 min-h-28">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center my-6">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Average rating</div>
          <div className="stat-value text-primary">{averageRating}</div>
       
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Review Count</div>
          <div className="stat-value text-secondary">{ratings.length}</div>
         
        </div>


      </div>
    </div>
  );
};

export default Table;
