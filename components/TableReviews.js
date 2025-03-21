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
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 30;
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

  // Calculate pagination values
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex w-full h-52 justify-center items-center mt-5 ">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <>
      <ul className="list bg-base-100 min-w-2xl">
        {reviews.length === 0 ? (
          <li className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="font-semibold text-base mb-2">No responses yet</h3>
            <p className="text-sm text-gray-500">Responses will appear here once users complete your survey.</p>
          </li>
        ) : (
          <>
            {currentReviews.map((review) => (
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
                  className="dropdown menu w-52 rounded-box  bg-base-100 shadow-sm"
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
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="btn btn-sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </ul>
    </>
  );
};

export default TableReviews;
