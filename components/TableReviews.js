"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { EllipsisVertical } from "lucide-react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();
import { format } from "date-fns";
import DeleteModal from "./DeleteModal";

const TableReviews = ({ id }) => {
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

          .eq("survey", id.surveyID);

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
      <ul className="list bg-base-100 rounded-box shadow-md min-w-2xl ">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          User responses
        </li>

        {reviews.map((review) => (
          <li key={review.id} className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
            <div>
              <div className="rating my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="mask mask-star"
                    aria-label={`${star} star`}
                    aria-current={review.rating === star ? "true" : "false"}
                  ></div>
                ))}
              </div>
              <div className="text-xs  font-semibold opacity-60">
                {format(new Date(review.created_at), "MMMM dd, yyyy HH:mm")}
              </div>
            </div>
            <p className="list-col-wrap text-xs">{`${review.review}`}</p>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
            {/* change popover-1 and --anchor-1 names. Use unique names for each dropdown */}
            {/* For TSX uncomment the commented types below */}
            <button
              className="btn btn-ghost"
              popoverTarget={`popover-${review.id}`}
              style={
                {
                  anchorName: `--anchor-${review.id}`,
                } /* as React.CSSProperties */
              }
            >
              <EllipsisVertical />
            </button>
                            <ul
                              className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                              popover="auto"
                              id={`popover-${review.id}`} // unique id for each item
                              style={
                                {
                                  positionAnchor: `--anchor-${review.id}`, // matching style for the dropdown
                                } /* as React.CSSProperties */
                              }
                            >
                              <li>
                                <DeleteModal
                                  object="review"
                                  objectID={review.id}
                                  objectTitle={review.review}
                                  onDeleteSuccess={(deletedId) =>
                                    setReviews((prevReviews) =>
                                      prevReviews.filter(
                                        (review) => review.id !== deletedId
                                      )
                                    )
                                  }
                                />
                              </li>
                            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TableReviews;
