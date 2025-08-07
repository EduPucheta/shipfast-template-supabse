"use client";
import PreviewSurvey from "@/components/PreviewSurvey";
import { useEffect, useState, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function WidgetPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSurveyId, setActiveSurveyId] = useState(null);
  const [surveyTheme, setSurveyTheme] = useState("light");
  const [pageUrl, setPageUrl] = useState(null);
  const [browser, setBrowser] = useState(null);
  const [parentOrigin, setParentOrigin] = useState('*');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const [country, setCountry] = useState('Unknown');

  // Function to check if current page matches survey targeting
  const checkPageMatching = (survey, currentPath) => {
    function normalizePath(path) {
      if (!path) return '';
      try {
        // Accept full URLs or paths; always compare pathnames without trailing slash
        const pathname = path.startsWith('http') ? new URL(path).pathname : path;
        return pathname.length > 1 && pathname.endsWith('/')
          ? pathname.slice(0, -1)
          : pathname;
      } catch {
        return path;
      }
    }

    const normalizedCurrent = normalizePath(currentPath);

    // If targeting all pages, always show
    if (survey.targeting_type === 'all_pages') return true;

    // If targeting specific pages, check each target URL
    if (survey.targeting_type === 'specific_pages' && survey.target_urls) {
      return survey.target_urls.some((entry) => {
        // Support legacy format where entries were strings
        if (typeof entry === 'string') {
          return normalizePath(entry) === normalizedCurrent;
        }

        if (!entry || typeof entry !== 'object') return false;

        const targetPath = normalizePath(entry.path || '');
        const matchType = entry.matchType || 'exact';

        if (!targetPath) return false;

        if (matchType === 'exact') {
          return normalizedCurrent === targetPath;
        }
        if (matchType === 'contains') {
          return normalizedCurrent.includes(targetPath);
        }
        return false;
      });
    }

    return false;
  };

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);

    // Only access browser APIs after mounting
    const params = new URLSearchParams(window.location.search);
    const url = params.get('pageUrl');
    const browserInfo = params.get('browser');
    const origin = params.get('parentOrigin');
    const spaceIdParam = params.get('space_id');
    const deviceTypeParam = params.get('deviceType');
    const countryParam = params.get('country');

    if (url) setPageUrl(url);
    if (browserInfo) setBrowser(browserInfo);
    if (origin) setParentOrigin(origin);
    if (deviceTypeParam) setDeviceType(deviceTypeParam);
    if (countryParam) setCountry(countryParam);

    // Fetch active survey without authentication
    const fetchActiveSurvey = async () => {
      if (!spaceIdParam) {
        setError('Space ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        // Use device type passed from parent window
        console.log('Widget device type received from parent:', deviceTypeParam || deviceType);
        console.log('Widget country received from parent:', countryParam || country);

        // First, get all active surveys for this space with their device targets and targeting info
        const { data: surveys, error: surveysError } = await supabase
          .from('surveys')
          .select(`
            id, 
            survey_theme,
            created_at,
            targeting_type,
            target_urls,
            survey_devices(device_name)
          `)
          .eq('is_active', true)
          .eq('space_id', spaceIdParam)
          .order('created_at', { ascending: false });

        if (surveysError) {
          console.error('Error fetching surveys:', surveysError);
          setError("No active survey found");
          setIsLoading(false);
          return;
        }

        // Filter surveys that target the current device and page
        const currentDevice = deviceTypeParam || deviceType;
        const currentPath = url ? new URL(url).pathname : window.location.pathname;
        
        const compatibleSurveys = surveys?.filter(survey => {
          const deviceTargets = survey.survey_devices?.map(d => d.device_name) || [];
          const deviceMatches = deviceTargets.includes(currentDevice);
          const pageMatches = checkPageMatching(survey, currentPath);
          
          console.log(`Survey ${survey.id}: device matches ${deviceMatches}, page matches ${pageMatches}`);
          return deviceMatches && pageMatches;
        }) || [];

        // Get the most recent survey that targets the current device
        if (compatibleSurveys.length > 0) {
          const survey = compatibleSurveys[0];
          console.log('Found compatible survey:', survey.id, 'for device:', currentDevice);
          setActiveSurveyId(survey.id);
          setSurveyTheme(survey.survey_theme || "light");
          setError(null);
        } else {
          console.log('No surveys found for device type:', currentDevice);
          setError(`No active survey found for ${currentDevice} devices`);
        }
      } catch (err) {
        console.error("Error in fetchActiveSurvey:", err);
        setError("Failed to load survey");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveSurvey();
  }, [deviceType]);

  // Define handlers before they're used in useEffect
  const handleCollapse = useCallback(() => {
    if (window.parent) {
      window.parent.postMessage({ type: "collapse-widget" }, parentOrigin);
    }
    setIsExpanded(false);
  }, [parentOrigin]);

  const handleExpand = () => {
    if (window.parent) {
      window.parent.postMessage({ type: "expand-widget" }, parentOrigin);
    }
    setIsExpanded(true);
  };

    // Notify parent when widget is ready
  useEffect(() => {
    if (!isMounted || isLoading) return;

    // Use setTimeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      if (window.parent) {
        window.parent.postMessage({ type: "widget-ready" }, parentOrigin);
        
          // Also send height information for dynamic sizing; hide when no targeted survey
          const height = activeSurveyId ? 40 : 0;
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
  }, [isMounted, parentOrigin, handleCollapse]);

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="bg-transparent w-full h-full flex items-center justify-center" suppressHydrationWarning={true}>
        {/* Loader disabled */}
      </div>
    );
  }

  // Loading state disabled
  // if (isLoading) {
  //   return (
  //     <div className="bg-transparent w-full h-full flex items-center justify-center" suppressHydrationWarning={true}>
  //       <div className="flex items-center gap-2 text-gray-500">
  //         <Loader2 className="w-4 h-4 animate-spin" />
  //         <span className="text-sm">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  // Show error state or hide widget if no survey
  if (error || !activeSurveyId) {
    return (
      <div className="bg-transparent w-full h-full flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="text-xs text-gray-400 text-center px-2">
        
        </div> 
      </div>
    );
  }

  return (
    <div data-theme={surveyTheme} className="bg-transparent w-full h-full" suppressHydrationWarning={true}>
      {isExpanded ? (
        <div className="relative w-full h-full bg-white rounded-lg ">
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
              deviceType={deviceType}
              country={country}
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
