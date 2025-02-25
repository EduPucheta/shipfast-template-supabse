"use client"
import React, { useState } from "react";
import CreateSurvey from "@/components/CreateSurvey";
import DisplaySurvey from "@/components/DisplaySurvey";

export default function NewSurveyPage() {
  // Lifted state for question1
  const [question1, setQuestion1] = useState("How would you rate your experience?");

  return (
    <div className="mx-auto p-6 flex flex-row justify-center items-start gap-10">
      <CreateSurvey question1={question1} setQuestion1={setQuestion1} />
      <DisplaySurvey question1={question1} />
    </div>
  );
}
