'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SurveyAnalytics({ id }) {
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchPageResponseCounts() {
      if (!id?.surveyID) return;

      try {
        // Fetch all reviews for this survey
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('page')
          .eq('survey', id.surveyID);

        if (error) throw error;
        
        // Count responses by page
        const pageCounts = {};
        reviews.forEach(review => {
          const page = review.page || 'Unknown Page';
          pageCounts[page] = (pageCounts[page] || 0) + 1;
        });
        
        // Convert to array for easier rendering
        const pageDataArray = Object.entries(pageCounts).map(([url, count]) => ({
          url,
          count,
          // Extract domain from URL for display
          domain: extractDomain(url)
        }));
        
        // Sort by count in descending order
        pageDataArray.sort((a, b) => b.count - a.count);
        
        setPageData(pageDataArray);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load page response data');
      } finally {
        setLoading(false);
      }
    }

    fetchPageResponseCounts();
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

  // Group by domain for summary statistics
  const domainStats = {};
  pageData.forEach(item => {
    const domain = item.domain;
    if (!domainStats[domain]) {
      domainStats[domain] = {
        totalResponses: 0,
        pages: 0
      };
    }
    domainStats[domain].totalResponses += item.count;
    domainStats[domain].pages += 1;
  });

  return (
    <div className="bg-base-100 p-6  ">
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
                      <span className="truncate max-w-xs">{formatUrl(item.url)}</span>
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
