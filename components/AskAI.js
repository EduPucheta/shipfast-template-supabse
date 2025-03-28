"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SendHorizontal } from "lucide-react";
import TypewriterText from "./TypewriterText"; 

const supabase = createClientComponentClient();

export default function AskAI({ id }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [remainingTokens, setRemainingTokens] = useState(null);

  const suggestedQuestions = [
    "What are the key insights from the survey responses?",
    "What are the most common feedback themes?",
    "How satisfied are users with our service?",
    "What areas need improvement based on the feedback?",
    "What are the positive aspects mentioned in the responses?"
  ];

  const handleSuggestedQuestionClick = (question) => {
    setMessage(question);
  };

  useEffect(() => {
    async function fetchSurveyData() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("survey", id.surveyID);

        if (error) throw error;
        setSurveyData(data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
        setError("Failed to load survey data");
      }
    }

    if (id?.surveyID) {
      fetchSurveyData();
    }
  }, [id?.surveyID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          surveyData: surveyData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      setRemainingTokens(data.remainingTokens);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100  min-h-[600px] w-full">
      <div className="card-body p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.role === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div className={`chat-bubble ${
                msg.role === "user" ? "chat-bubble-primary" : "chat-bubble-secondary"
              } whitespace-pre-wrap max-w-[80%] prose`}>
                {msg.role === "assistant" ? (
                  <TypewriterText text={msg.content} speed={30} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center">
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-base-300">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="join w-full">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about your survey responses..."
                  className="input input-bordered join-item flex-1"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary join-item" 
                  disabled={loading || !message.trim()}
                >
                  <SendHorizontal size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestedQuestionClick(question)}
                    className="btn btn-sm btn-ghost btn-outline"
                    disabled={loading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </form>
          {remainingTokens !== null && (
                <div className="text-sm my-2">
                  Remaining tokens this month: {remainingTokens.toLocaleString()}
                </div>
              )}
        </div>

      </div>

    </div>
  );
}
