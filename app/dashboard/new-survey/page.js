"use client"
import React, { useState } from "react";
import CreateSurvey from "@/components/CreateSurvey";
import PreviewSurvey from "@/components/PreviewSurvey";

export default function NewSurveyPage() {
  // Lifted state for question1
  const [question1, setQuestion1] = useState("How would you rate your experience?");
  const [surveyTheme, setSurveyTheme] = useState("cupcake");
  const [reactionType, setreactionType] = useState("Stars");

  return (
    <div className="mx-auto p-6 flex flex-row justify-center items-start gap-14">
      <CreateSurvey  />
      <PreviewSurvey isPreview={true }  />
    </div>
  );
}
