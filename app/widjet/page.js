"use client";
import PreviewSurvey from "@/components/PreviewSurvey";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function WidgetPage() {
  console.log("[WidgetPage] Render");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSurveyId, setActiveSurveyId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pageUrl, setPageUrl] = useState(null);
  const [browser, setBrowser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    getUser();
    console.log("[WidgetPage] useEffect (getUser) ran");
  }, []);

  useEffect(() => {
    const fetchActiveSurvey = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("surveys")
        .select("id")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching active survey:", error);
      } else if (data) {
        setActiveSurveyId(data.id);
      }
    };

    if (userId) {
      console.log("[WidgetPage] useEffect (fetchActiveSurvey) ran, userId:", userId);
      fetchActiveSurvey();
    }
  }, [userId]);

  useEffect(() => {
    // Check if we're in expanded mode
    const params = new URLSearchParams(window.location.search);
    const expanded = params.get("expanded") === "true";
    const url = params.get("pageUrl");
    const browserInfo = params.get("browser");
    setIsExpanded(expanded);
    if(url) {
      setPageUrl(url);
    }
    if (browserInfo) {
      setBrowser(browserInfo);
    }
    console.log("[WidgetPage] useEffect (expanded check), expanded:", expanded);

    if (!expanded) {
      // If not expanded, we're in the small button mode
      // Notify parent that widget is ready
      window.parent.postMessage({ type: "widget-ready" }, "*");
      console.log("[WidgetPage] postMessage: widget-ready");
    }
  }, []);

  const handleExpand = () => {
    console.log("[WidgetPage] handleExpand clicked");
    window.parent.postMessage({ type: "expand-survey" }, "*");
  };

  const handleCollapse = () => {
    console.log("[WidgetPage] handleCollapse clicked");
    window.parent.postMessage({ type: "collapse-survey" }, "*");
  };

  return (
    <div className="bg-transparent">
      {isExpanded ? (
        <div className="relative w-full h-full">
          <button
            onClick={handleCollapse}
            className="absolute top-4 right-4 text-base-300 cursor-pointer z-10"
          >
            ✕
          </button>
          {activeSurveyId && <PreviewSurvey isPreview={false} surveyID={activeSurveyId} showDeviceToggles={false} pageUrl={pageUrl} browser={browser}/>}
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              console.log("[WidgetPage] Feedback 2 button clicked");
              handleExpand();
            }}
            className="btn btn-primary cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex flex-row  items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Feedback
          </button>
        </>
      )}
    </div>
  );
}
