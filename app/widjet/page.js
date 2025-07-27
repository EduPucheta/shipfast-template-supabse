"use client";
import PreviewSurvey from "@/components/PreviewSurvey";
import { useEffect, useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function WidgetPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSurveyId, setActiveSurveyId] = useState(null);
  const [pageUrl, setPageUrl] = useState(null);
  const [browser, setBrowser] = useState(null);
  const [parentOrigin, setParentOrigin] = useState('*');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Only access browser APIs after mounting
    const params = new URLSearchParams(window.location.search);
    const url = params.get("pageUrl");
    const browserInfo = params.get("browser");
    const origin = params.get("parentOrigin");

    if(url) setPageUrl(url);
    if (browserInfo) setBrowser(browserInfo);
    if (origin) setParentOrigin(origin);

    // Fetch active survey for the current domain
    const fetchActiveSurvey = async () => {
      try {
        // Extract domain from pageUrl for domain-based filtering
        let currentDomain = null;
        if (url) {
          try {
            currentDomain = new URL(url).hostname;
          } catch (e) {
            console.warn("Could not parse domain from URL:", url);
          }
        }

        const { data, error } = await supabase
          .from("surveys")
          .select("id, target_urls, targeting_type")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching active surveys:", error);
          setError("No active survey found");
          return;
        }

        // Filter surveys based on domain/URL targeting
        const matchingSurvey = data?.find(survey => {
          // If no domain info available, show any survey (fallback behavior)
          if (!currentDomain) return true;
          
          // If survey targets all pages, it matches
          if (survey.targeting_type === 'all_pages' || !survey.target_urls || survey.target_urls.length === 0) {
            return true;
          }
          
          // Check if current domain/URL matches any target URLs
          return survey.target_urls.some(targetUrl => {
            if (!targetUrl) return false;
            
            try {
              // Handle different URL formats
              if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                const targetDomain = new URL(targetUrl).hostname;
                return currentDomain === targetDomain || currentDomain.endsWith('.' + targetDomain);
              } else if (targetUrl.includes('.')) {
                // Treat as domain
                return currentDomain === targetUrl || currentDomain.endsWith('.' + targetUrl);
              } else {
                // Treat as partial match
                return currentDomain.includes(targetUrl) || url.includes(targetUrl);
              }
            } catch (e) {
              // Fallback to simple string matching
              return currentDomain.includes(targetUrl) || url.includes(targetUrl);
            }
          });
        });

        if (matchingSurvey) {
          setActiveSurveyId(matchingSurvey.id);
          setError(null);
        } else {
          setError("No survey configured for this website");
        }
      } catch (err) {
        console.error("Error in fetchActiveSurvey:", err);
        setError("Failed to load survey");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveSurvey();
  }, []);

  // Notify parent when widget is ready
  useEffect(() => {
    if (!isMounted || isLoading) return;

    // Use setTimeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      if (window.parent) {
        window.parent.postMessage({ type: "widget-ready" }, parentOrigin);
        
        // Also send height information for dynamic sizing
        const height = activeSurveyId ? 60 : 40;
        window.parent.postMessage({ 
          type: "widget-height-change", 
          height 
        }, parentOrigin);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted, isLoading, activeSurveyId, parentOrigin]);

  // Listen for messages from parent
  useEffect(() => {
    if (!isMounted) return;

    const handleMessage = (event) => {
      if (event.origin !== parentOrigin && parentOrigin !== '*') return;
      
      if (event.data.type === 'close-widget') {
        handleCollapse();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isMounted, parentOrigin]);

  const handleExpand = () => {
    if (window.parent) {
      window.parent.postMessage({ type: "expand-widget" }, parentOrigin);
    }
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    if (window.parent) {
      window.parent.postMessage({ type: "collapse-widget" }, parentOrigin);
    }
    setIsExpanded(false);
  };

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="bg-transparent w-full h-full flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-transparent w-full h-full flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state or hide widget if no survey
  if (error || !activeSurveyId) {
    return (
      <div className="bg-transparent w-full h-full flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="text-xs text-gray-400 text-center px-2">
          {error || "No active survey"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent w-full h-full" suppressHydrationWarning={true}>
      {isExpanded ? (
        <div className="relative w-full h-full bg-white rounded-lg shadow-lg">
          <button
            onClick={handleCollapse}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-4 h-full">
            <PreviewSurvey 
              isPreview={false} 
              surveyID={activeSurveyId} 
              showDeviceToggles={false} 
              pageUrl={pageUrl} 
              browser={browser}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleExpand}
          className="btn btn-primary cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex flex-row items-center gap-2 text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          Feedback
        </button>
      )}
    </div>
  );
}
