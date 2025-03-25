"use client";
import PreviewSurvey from "@/components/PreviewSurvey";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export default function WidgetPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if we're in expanded mode
    const expanded = new URLSearchParams(window.location.search).get('expanded') === 'true';
    setIsExpanded(expanded);
    
    if (!expanded) {
      // If not expanded, we're in the small button mode
      // Notify parent that widget is ready
      window.parent.postMessage({ type: 'widget-ready' }, '*');
    }
  }, []);

  const handleExpand = () => {
    window.parent.postMessage({ type: 'expand-survey' }, '*');
  };

  const handleCollapse = () => {
    window.parent.postMessage({ type: 'collapse-survey' }, '*');
  };

  return (
    <div className="bg-transparent">
      {isExpanded ? (
        <div className="relative w-full h-full">
          <button 
            onClick={handleCollapse}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <PreviewSurvey isPreview={false} surveyID={42} />
        </div>
      ) : (
        <>
    
        <button
          onClick={handleExpand}
          className="btn btn-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex flex-row  items-center gap-2"
        >
              <MessageSquare className="w-5 h-5" />
          Feedback 
        </button>
        </>
      )}
    </div>
  );
}
