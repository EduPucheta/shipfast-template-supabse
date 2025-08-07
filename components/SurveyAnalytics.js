'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as d3 from 'd3';

export default function SurveyAnalytics({ id }) {
  const [pageData, setPageData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [wordData, setWordData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);
  
  const supabase = createClientComponentClient();

  // Common words to exclude from word cloud
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
  ]);

  useEffect(() => {
    async function fetchData() {
      if (!id?.surveyID) return;

      try {
        // Fetch all reviews for this survey
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('page, rating, review, category, country')
          .eq('survey', id.surveyID);

        if (error) throw error;
        
        // Count responses by page
        const pageCounts = {};
        const ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        const wordCounts = {};
        const categoryCounts = {};
        const countryCounts = {};
        
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

          // Process review text for word cloud
          if (review.review) {
            const words = review.review.toLowerCase()
              .replace(/[^\w\s]/g, '') // Remove punctuation
              .split(/\s+/)
              .filter(word => word.length > 2 && !commonWords.has(word));
            
            words.forEach(word => {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            });
          }

          // Count by category
          const category = review.category || 'Uncategorized';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;

          // Count by country
          const country = review.country || 'Unknown';
          countryCounts[country] = (countryCounts[country] || 0) + 1;
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

        // Convert word counts to array and sort by frequency
        const wordDataArray = Object.entries(wordCounts)
          .map(([word, count]) => ({
            word,
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 50); // Take top 50 words
        
        // Convert category counts to array and sort by count
        const categoryDataArray = Object.entries(categoryCounts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);

        // Convert country counts to array and sort by count
        const countryDataArray = Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);
        
        setPageData(pageDataArray);
        setRatingData(ratingDataArray);
        setWordData(wordDataArray);
        setCategoryData(categoryDataArray);
        setCountryData(countryDataArray);
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

  // Bubble chart dimensions
  const width = 400;
  const height = 400;

  // Prepare packed data for D3
  let packedWords = [];
  if (wordData.length > 0) {
    // D3 hierarchy expects a root node
    const root = d3.hierarchy({ children: wordData })
      .sum(d => d.count);
    const pack = d3.pack()
      .size([width, height])
      .padding(6);
    const packed = pack(root);
    packedWords = packed.leaves();
  }

  // Color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Rating Distribution Chart */}
        <div className="w-full">
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

        {/* Country Distribution Chart */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Responses by Country</h2>
          <div className="space-y-2">
            {countryData.slice(0, 10).map((item) => {
              const percentage = ((item.count / totalResponses) * 100).toFixed(1);
              return (
                <div key={item.country} className="flex items-center gap-4">
                  <span className="w-20 text-right text-sm">{item.country}</span>
                  <div className="flex-1">
                    <div className="h-6 bg-base-200 rounded-lg overflow-hidden">
                      <div 
                        className="tooltip tooltip-right h-full bg-secondary transition-all duration-500"
                        data-tip={`${item.count} responses (${percentage}% of total)`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-right text-sm">{item.count} ({percentage}%)</span>
                </div>
              );
            })}
            {countryData.length > 10 && (
              <div className="text-sm text-gray-500 mt-2">
                +{countryData.length - 10} more countries
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Bubble Chart for Most Common Words */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Most Common Words</h2>
          <div className="w-full flex justify-center">
            <svg ref={svgRef} width={width} height={height}>
              {packedWords.map((node, i) => (
                <g key={i} transform={`translate(${node.x},${node.y})`}>
                  <circle
                    r={node.r}
                    fill={color(i)}
                    fillOpacity={0.7}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  <text
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize={Math.max(10, node.r * 0.5)}
                    fill="#222"
                    style={{ pointerEvents: 'none', fontWeight: 600 }}
                  >
                    {node.data.word}
                  </text>
                  <title>{`${node.data.word}: ${node.data.count} occurrences`}</title>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Reviews by Category Donut Chart */}
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Reviews by Category</h2>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 relative">
            {categoryData.length === 0 ? (
              <div className="text-center text-gray-500">No category data available.</div>
            ) : (
              <>
                {/* Donut chart on the left */}
                <div style={{ position: 'relative' }}>
                  <svg width={300} height={250} viewBox="0 0 300 250">
                    <g transform="translate(150,125)">
                      {(() => {
                        const pie = d3.pie().value(d => d.count)(categoryData);
                        const arc = d3.arc().innerRadius(60).outerRadius(100);
                        return pie.map((d, i) => (
                          <g key={d.data.category}>
                            <path
                              d={arc(d)}
                              fill={color(i)}
                              stroke="#fff"
                              strokeWidth={2}
                              onMouseEnter={() => setHoveredCategory({ category: d.data.category, count: d.data.count, x: arc.centroid(d)[0], y: arc.centroid(d)[1] })}
                              onMouseLeave={() => setHoveredCategory(null)}
                              style={{ cursor: 'pointer' }}
                            />
                            {/* Percentage label */}
                            {d.endAngle - d.startAngle > 0.2 && (
                              <text
                                transform={`translate(${arc.centroid(d)})`}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize={13}
                                fill="#222"
                                fontWeight={600}
                              >
                                {((d.data.count / categoryData.reduce((sum, c) => sum + c.count, 0)) * 100).toFixed(0)}%
                              </text>
                            )}
                          </g>
                        ));
                      })()}
                    </g>
                  </svg>
                  {/* Tooltip for hovered segment */}
                  {hoveredCategory && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 150 + hoveredCategory.x,
                        top: 125 + hoveredCategory.y - 40,
                        background: 'rgba(0,0,0,0.85)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 6,
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        fontSize: 14,
                        fontWeight: 500,
                        zIndex: 10,
                        transform: 'translate(-50%, -100%)',
                      }}
                    >
                      {hoveredCategory.category}: {hoveredCategory.count}
                    </div>
                  )}
                </div>
                {/* Legend on the right */}
                <div className="flex flex-col gap-2 w-full">
                  {categoryData.map((item, i) => (
                    <div key={item.category} className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded" style={{ background: color(i) }}></span>
                      <span className="truncate max-w-full" title={item.category}>{item.category}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
