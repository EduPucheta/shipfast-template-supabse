"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { EllipsisVertical, ExternalLink, X, CalendarDays, Download, Sheet, Smartphone, Tablet, Monitor } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import DeleteModal from "./DeleteModal";

const supabase = createClientComponentClient();

const TableReviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 30;
  const [userId, setUserId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [ratingFilter, setRatingFilter] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    rating: true,
    created_at: true,
    review: true,
    page: true,
    country: true,
    device: true,
    browser: true,
    actions: true,
  });
 
  // Refs for popovers
  const startDatePopoverRef = useRef(null);
  const endDatePopoverRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user.id);
    };

    getUser();
  }, []);

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
  }, [userId, id.surveyID]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedReviews = () => {
    if (!reviews.length) return [];
    
    let filteredReviews = [...reviews];

    // Apply rating filter
    if (ratingFilter) {
      filteredReviews = filteredReviews.filter(review => review.rating === parseInt(ratingFilter));
    }

    // Apply page filter
    if (pageFilter) {
      filteredReviews = filteredReviews.filter(review => review.page === pageFilter);
    }

    // Apply date filter
    if (startDateFilter) {
      filteredReviews = filteredReviews.filter(review => new Date(review.created_at) >= new Date(startDateFilter));
    }
    if (endDateFilter) {
      // Add 1 day to endDateFilter to include reviews from that day
      const endDate = new Date(endDateFilter);
      endDate.setDate(endDate.getDate() + 1);
      filteredReviews = filteredReviews.filter(review => new Date(review.created_at) < endDate);
    }

    // Apply keyword filter
    if (keywordFilter) {
      const lowercasedKeyword = keywordFilter.toLowerCase();
      filteredReviews = filteredReviews.filter(review =>
        (review.review && review.review.toLowerCase().includes(lowercasedKeyword)) ||
        (review.page && review.page.toLowerCase().includes(lowercasedKeyword)) ||
        (review.country && review.country.toLowerCase().includes(lowercasedKeyword)) ||
        (review.device && review.device.toLowerCase().includes(lowercasedKeyword)) ||
        (review.browser && review.browser.toLowerCase().includes(lowercasedKeyword))
      );
    }

    return filteredReviews.sort((a, b) => {
      if (sortConfig.key === 'rating') {
        return sortConfig.direction === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      
      if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }
      
      if (sortConfig.key === 'review') {
        return sortConfig.direction === 'asc'
          ? a.review.localeCompare(b.review)
          : b.review.localeCompare(a.review);
      }
      
      if (sortConfig.key === 'page') {
        return sortConfig.direction === 'asc'
          ? (a.page || '').localeCompare(b.page || '')
          : (b.page || '').localeCompare(a.page || '');
      }
      
      if (sortConfig.key === 'country') {
        return sortConfig.direction === 'asc'
          ? (a.country || '').localeCompare(b.country || '')
          : (b.country || '').localeCompare(a.country || '');
      }

      if (sortConfig.key === 'device') {
        return sortConfig.direction === 'asc'
          ? (a.device || '').localeCompare(b.device || '')
          : (b.device || '').localeCompare(a.device || '');
      }

      if (sortConfig.key === 'browser') {
        return sortConfig.direction === 'asc'
          ? (a.browser || '').localeCompare(b.browser || '')
          : (b.browser || '').localeCompare(a.browser || '');
      }
      
      return 0;
    });
  };

  // Calculate pagination values
  const sortedReviews = getSortedReviews();
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = sortedReviews.slice(startIndex, endIndex);

  const handleDownload = () => {
    if (!sortedReviews.length) return;

    const headers = [
      "ID",
      "Created At",
      "Rating",
      "Review",
      "Page",
      "Country",
      "Device",
      "Browser",
      "Survey ID",
      "User ID",
    ];
    const csvContent = [
      headers.join(","),
      ...sortedReviews.map((review) =>
        [
          review.id,
          format(new Date(review.created_at), "yyyy-MM-dd HH:mm:ss"),
          review.rating,
          `"${review.review?.replace(/"/g, '""') || ""}"`,
          `"${review.page?.replace(/"/g, '""') || ""}"`,
          `"${review.country?.replace(/"/g, '""') || ""}"`,
          `"${review.device?.replace(/"/g, '""') || ""}"`,
          `"${review.browser?.replace(/"/g, '""') || ""}"`,
          review.survey,
          review.user_id,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reviews_${id.surveyID}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const highlightKeyword = (text, keyword) => {
    if (!keyword || !text) return text;
    const lowercasedText = text.toLowerCase();
    const lowercasedKeyword = keyword.toLowerCase();
    let result = [];
    let lastIndex = 0;
    let index = lowercasedText.indexOf(lowercasedKeyword);

    while (index !== -1) {
      result.push(text.substring(lastIndex, index));
      result.push(<mark key={lastIndex + index}>{text.substring(index, index + keyword.length)}</mark>);
      lastIndex = index + keyword.length;
      index = lowercasedText.indexOf(lowercasedKeyword, lastIndex);
    }
    result.push(text.substring(lastIndex));
    return <>{result}</>; // Return as a fragment
  };

  // --- Helper functions to get icons --- START
  const getDeviceIcon = (deviceName) => {
    if (!deviceName) return null;
    const lowerDevice = deviceName.toLowerCase();
    if (lowerDevice.includes("mobile")) return <Smartphone className="h-5 w-5" />;
    if (lowerDevice.includes("tablet")) return <Tablet className="h-5 w-5" />;
    if (lowerDevice.includes("desktop")) return <Monitor className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />; // Default to Desktop
  };
  // --- Helper functions to get icons --- END

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
          <div className="flex justify-end gap-4 mb-4 mt-2 flex-wrap">
            <div>
              <select 
                id="rating-filter" 
                className="select select-bordered w-full max-w-xs"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">All Ratings</option>
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <select
                id="page-filter"
                className="select select-bordered w-full max-w-xs"
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
              >
                <option value="">All Pages</option>
                {[...new Set(reviews.map(r => r.page))].filter(Boolean).map(p => <option key={p} value={p}>{p.replace(/^https?:\/\/[^/]+/, '')}</option>)}
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Filter by keyword..."
                className="input input-bordered w-full max-w-xs"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Start Date Picker */}
                <div className="relative">
                  <button
                    type="button"
                    className="input input-bordered w-full max-w-xs flex items-center justify-start font-normal"
                    popoverTarget="start-date-popover"
                    style={{ anchorName: "--start-date-anchor" }}
                  >
                    <CalendarDays className="h-4 w-4 mr-2 opacity-70" />
                    {startDateFilter ? format(new Date(startDateFilter), "MMM dd, yyyy") : "Start Date"}
                  </button>
                  {startDateFilter && (
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent focus:outline-none z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStartDateFilter('');
                      }}
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                  <div
                    ref={startDatePopoverRef}
                    id="start-date-popover"
                    popover="auto"
                    className="dropdown menu p-2 bg-base-100 rounded-box shadow-lg z-20"
                    style={{ positionAnchor: "--start-date-anchor" }}
                  >
                    <DayPicker
                      mode="single"
                      selected={startDateFilter ? new Date(startDateFilter) : undefined}
                      onSelect={(date) => {
                        setStartDateFilter(date ? format(date, "yyyy-MM-dd") : '');
                        startDatePopoverRef.current?.hidePopover();
                      }}
                      disabled={endDateFilter ? { after: new Date(endDateFilter) } : undefined}
                    />
                  </div>
                </div>

                <span className="text-gray-500 hidden sm:inline">-</span>

                {/* End Date Picker */}
                <div className="relative">
                  <button
                    type="button"
                    className="input input-bordered w-full max-w-xs flex items-center justify-start font-normal"
                    popoverTarget="end-date-popover"
                    style={{ anchorName: "--end-date-anchor" }}
                  >
                    <CalendarDays className="h-4 w-4 mr-2 opacity-70" />
                    {endDateFilter ? format(new Date(endDateFilter), "MMM dd, yyyy") : "End Date"}
                  </button>
                  {endDateFilter && (
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent focus:outline-none z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEndDateFilter('');
                      }}
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                  <div
                    ref={endDatePopoverRef}
                    id="end-date-popover"
                    popover="auto"
                    className="dropdown dropdown-end menu p-2 bg-base-100 rounded-box shadow-lg z-20"
                    style={{ positionAnchor: "--end-date-anchor" }}
                  >
                    <DayPicker
                      mode="single"
                      selected={endDateFilter ? new Date(endDateFilter) : undefined}
                      onSelect={(date) => {
                        setEndDateFilter(date ? format(date, "yyyy-MM-dd") : '');
                        endDatePopoverRef.current?.hidePopover();
                      }}
                      disabled={startDateFilter ? { before: new Date(startDateFilter) } : undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button 
              className="btn btn-ghost"
              onClick={handleDownload}
              disabled={!sortedReviews.length}
              title="Download Reviews"
            >
              <Download className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                className="btn btn-ghost"
                popoverTarget="column-select-popover"
                title="Customize Columns"
                style={{ anchorName: "--column-select-anchor" }}
              >
                <Sheet className="h-5 w-5" />
              </button>
              <div
                id="column-select-popover"
                popover="auto"
                className="dropdown menu p-4 bg-base-100 rounded-box shadow-lg z-20 w-64"
                style={{ positionAnchor: "--column-select-anchor" }}
              >
                <p className="text-sm font-semibold mb-2">Customize Columns</p>
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className="label cursor-pointer justify-start gap-2 w-full">
                    <input
                      type="checkbox"
                      checked={visibleColumns[col]}
                      onChange={() =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [col]: !prev[col],
                        }))
                      }
                      className="checkbox checkbox-sm"
                    />
                    <span className="label-text capitalize">{col.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {visibleColumns.rating && (
                  <th 
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() => handleSort('rating')}
                  >
                    Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                {visibleColumns.created_at && (
                  <th 
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() => handleSort('created_at')}
                  >
                    Date {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                {visibleColumns.review && (
                  <th 
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() => handleSort('review')}
                  >
                    Review {sortConfig.key === 'review' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                {visibleColumns.page && (
                  <th 
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() => handleSort('page')}
                  >
                    Page {sortConfig.key === 'page' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                {visibleColumns.country && (
                  <th 
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() => handleSort('country')}
                  >
                    Country {sortConfig.key === 'country' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                {visibleColumns.device && (
                  <th 
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() => handleSort('device')}
                  >
                    Device {sortConfig.key === 'device' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                {visibleColumns.browser && (
                  <th 
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() => handleSort('browser')}
                  >
                    Browser {sortConfig.key === 'browser' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                )}
                {visibleColumns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr key={review.id}>
                  {visibleColumns.rating && <td>{renderRating(review.rating)}</td>}
                  {visibleColumns.created_at && (
                    <td>
                      <div className="tooltip" data-tip={format(new Date(review.created_at), "MMM dd, yyyy HH:mm")}>
                        <span className="text-xs font-semibold opacity-60">
                          {format(new Date(review.created_at), new Date(review.created_at).getFullYear() === new Date().getFullYear() ? "MMM dd, HH:mm" : "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.review && (
                    <td>
                      <span className="text-sm whitespace-pre-wrap break-words">
                        {highlightKeyword(review.review, keywordFilter)}
                      </span>
                    </td>
                  )}
                  {visibleColumns.page && (
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
                              {highlightKeyword(review.page.replace(/^https?:\/\/[^/]+/, ''), keywordFilter)}
                            </span>
                          </div>
                        </a>
                      )}
                    </td>
                  )}
                  {visibleColumns.country && (
                    <td>
                      <div className="tooltip" data-tip={review.country}>
                        <span className="text-sm whitespace-pre-wrap break-words">
                          {highlightKeyword(review.country, keywordFilter)}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.device && (
                    <td>
                      <div className="tooltip" data-tip={review.device}>
                        {getDeviceIcon(review.device)}
                      </div>
                    </td>
                  )}
                  {visibleColumns.browser && (
                    <td>
                      <div className="tooltip" data-tip={review.browser}>
                        <span className="text-sm whitespace-pre-wrap break-words">
                          {highlightKeyword(review.browser, keywordFilter)}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.actions && (
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
                  )}
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
