// app/context/SurveyContext.js
"use client"
import React, { createContext, useContext, useState } from "react";

const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  const [question1, setQuestion1] = useState("How would you rate your experience?");
  const [surveyTheme, setSurveyTheme] = useState("cupcake");
  const [reactionType, setreactionType] = useState("Stars");
  const [submitButtonText, setSubmitButtonText] = useState("Submit");
  const [thankYouTitle, setThankYouTitle] = useState("Thank You!");
  const [thankYouText, setThankYouText] = useState("Your feedback has been submitted.");

  return (
    <SurveyContext.Provider
      value={{
        question1,
        setQuestion1,
        surveyTheme,
        setSurveyTheme,
        reactionType,
        setreactionType,
        submitButtonText,
        setSubmitButtonText,
        thankYouTitle,
        setThankYouTitle,
        thankYouText,
        setThankYouText,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
};
