"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();
import { format } from "date-fns";

const TableReviews = () => {
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

    if (!userId) return; // Only fetch if userId is available

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
      <div className="flex w-full h-52 justify-center items-center mt-5 ">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col border-opacity-50 gap-2 ">
        {reviews.map((review) => (
          <div
            className="flex bg-base-200 rounded-box p-6 duration-200 hover:shadow-lg cursor-pointer justify-between items-center gap-4"
            key={review.id}
          >
            <div className=" px-4 text-2xl font-bold">{review.rating}</div>
            <div className="flex flex-col justify-end items-end ">
              <div className="py-2  font-semibold">{`"${review.review}"`}</div>
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
