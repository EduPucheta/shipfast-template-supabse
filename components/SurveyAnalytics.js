'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SurveyAnalytics({ id }) {
  const [pageData, setPageData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchData() {
      if (!id?.surveyID) return;

      try {
        // Fetch all reviews for this survey
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('page, rating')
          .eq('survey', id.surveyID);

        if (error) throw error;
        
        // Count responses by page
        const pageCounts = {};
        const ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        
        reviews.forEach(review => {
          const page = review.page || 'Unknown Page';
          pageCounts[page] = (pageCounts[page] || 0) + 1;
          
          // Count ratings, rounding to nearest whole number
          if (review.rating) {
            const roundedRating = Math.round(parseFloat(review.rating));
            if (roundedRating >= 1 && roundedRating <= 5) {
              ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;
            }
          }
        });
        
        // Convert page counts to array for easier rendering
        const pageDataArray = Object.entries(pageCounts).map(([url, count]) => ({
          url,
          count,
          domain: extractDomain(url)
        }));
        
        // Sort by count in descending order
        pageDataArray.sort((a, b) => b.count - a.count);
        
        // Convert rating counts to array and sort by rating
        const ratingDataArray = Object.entries(ratingCounts)
          .map(([rating, count]) => ({
            rating: parseInt(rating),
            count
          }))
          .sort((a, b) => a.rating - b.rating);
        
        setPageData(pageDataArray);
        setRatingData(ratingDataArray);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load survey data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id?.surveyID, supabase]);

  // Extract domain from URL for cleaner display
  function extractDomain(url) {
    try {
      if (!url) return 'Unknown';
      const domain = new URL(url).hostname;
      return domain;
    } catch (e) {
      return url;
    }
  }

  // Format URL to show a shorter version
  function formatUrl(url) {
    try {
      if (!url) return 'Unknown';
      const urlObj = new URL(url);
      const path = urlObj.pathname === '/' ? '' : urlObj.pathname;
      return `${urlObj.hostname}${path}`;
    } catch (e) {
      return url;
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-error">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (pageData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="font-semibold text-base mb-2">No responses yet</h3>
        <p className="text-sm text-gray-500">Responses will appear here once users complete your survey.</p>
      </div>
    );
  }

  // Calculate total responses for percentage calculations
  const totalResponses = ratingData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-base-100 p-6">
      {/* Rating Distribution Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Rating Distribution</h2>
        <div className="space-y-2">
          {ratingData.map((item) => {
            const percentage = ((item.count / totalResponses) * 100).toFixed(1);
            return (
              <div key={item.rating} className="flex items-center gap-4">
                <span className="w-8 text-right">{item.rating} ★</span>
                <div className="flex-1">
                  <div className="h-6 bg-base-200 rounded-lg overflow-hidden">
                    <div 
                      className="tooltip tooltip-right h-full bg-primary transition-all duration-500"
                      data-tip={`${item.count} responses (${percentage}% of total)`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right">{item.count} ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Response Analysis by Page</h2>
      
      
      {/* Page Response Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Page URL</th>
              <th>Response Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, index) => {
              const totalResponses = pageData.reduce((sum, page) => sum + page.count, 0);
              const percentage = ((item.count / totalResponses) * 100).toFixed(1);
              
              return (
                <tr key={index}>
                  <td>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link link-hover flex items-center"
                    >
                      <div className="tooltip" data-tip={item.url}>
                        <span className="truncate max-w-xs">{formatUrl(item.url)}</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </td>
                  <td className="font-semibold">{item.count}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <progress className="progress progress-primary w-20" value={percentage} max="100"></progress>
                      <span>{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
