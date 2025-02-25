"use client"; // Necessary for Next.js components in the app directory using client-side rendering

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

const Survey = () => {


     const [SurveyID, setSurveyID] = useState([]);

  return (
    <div>
      <h1>Survey ID: </h1>
    </div>
  );
};
