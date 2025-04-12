"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { EllipsisVertical, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import DeleteModal from "./DeleteModal";

const supabase = createClientComponentClient();

const TableReviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 30;
  const [userId, setUserId] = useState(null);
 
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
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
          // Sort reviews by created_at in descending order (newest first)
          const sortedReviews = (data || []).sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          setReviews(sortedReviews);
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

  function renderRating(rating) {
    return (
      <div className="tooltip" data-tip={`Rating: ${rating}/5`}>
        <div className="rating rating-sm">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className="mask mask-star"
              aria-label={`${star} star`}
              aria-current={rating === star ? "true" : "false"}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="font-semibold text-base mb-2">No responses yet</h3>
          <p className="text-sm text-gray-500">Responses will appear here once users complete your survey.</p>
        </div>
      ) : (
        <>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Date</th>
                <th>Review</th>
                <th>Page</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr key={review.id}>
                  <td>{renderRating(review.rating)}</td>
                  <td>
                    <div className="tooltip" data-tip={format(new Date(review.created_at), "MMM dd, yyyy HH:mm")}>
                      <span className="text-xs font-semibold opacity-60">
                        {format(new Date(review.created_at), new Date(review.created_at).getFullYear() === new Date().getFullYear() ? "MMM dd, HH:mm" : "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="tooltip" data-tip={review.review}>
                      <span className="text-sm max-w-md line-clamp-2">{review.review}</span>
                    </div>
                  </td>
                  <td>
                    {review.page && (
                      <a 
                        href={review.page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:text-primary-focus flex items-center gap-1"
                      >
                        <ExternalLink className="size-3" />
                        <div className="tooltip" data-tip={review.page}>
                          <span className="truncate max-w-[150px]">
                            {review.page.replace(/^https?:\/\/[^\/]+/, '')}
                          </span>
                        </div>
                      </a>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      popoverTarget={`popover-${review.id}`}
                      style={{ anchorName: `--anchor-${review.id}` }}
                    >
                      <EllipsisVertical />
                    </button>
                    <ul
                      className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                      popover="auto"
                      id={`popover-${review.id}`}
                      style={{ positionAnchor: `--anchor-${review.id}` }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
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
    </div>
  );
};

export default TableReviews;
