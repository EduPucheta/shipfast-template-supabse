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
    <div className="flex flex-col h-[600px] w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className={`chat-bubble ${
              msg.role === "user" ? "chat-bubble-primary" : "chat-bubble-secondary"
            }`}>
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
          <div className="text-error text-sm text-center">
            {error}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your survey responses..."
              className="input input-bordered flex-1"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
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
                className="btn btn-sm btn-ghost"
                disabled={loading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
