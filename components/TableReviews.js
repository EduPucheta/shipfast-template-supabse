"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
import { format } from "date-fns";

const TableReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the session and set the userId
    const fetchSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }

      if (session?.user) {
        setUserId(session.user.id);
      } else {
        console.error("No user is authenticated!");
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex w-full h-full min-h-28 justify-center items-center mt-5 ">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col border-opacity-50 gap-2 ">
        {reviews.map((review) => (
          <div
            className="flex bg-base-100 rounded-box p-6 duration-200 hover:shadow-lg cursor-pointer justify-between items-center gap-4"
            key={review.id}
          >
            <div className=" px-4 text-2xl font-bold">{review.rating}</div>
            <div className="flex flex-col justify-end items-end ">
              <div className="py-2  font-semibold">"{review.review}"</div>
              <small>
                {format(new Date(review.created_at), "MMMM dd, yyyy HH:mm")}
              </small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TableReviews;
