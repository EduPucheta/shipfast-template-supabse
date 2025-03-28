import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { checkAndUpdateQuota } from "@/libs/quotas";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const { messages, surveyData } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Get the current user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Create a system message with survey context
    const systemMessage = {
      role: "system",
      content: `You are a helpful AI assistant that helps users understand their survey responses. 
      You have access to the following survey data: ${JSON.stringify(surveyData)}. 
      Use this data to provide accurate and relevant answers to the user's questions about their survey responses. Be concise and to the point.`
    };

    const completion = await client.chat.completions.create({ 
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000, 
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error("No response content received from OpenAI");
    }

    // Get total tokens used from the completion
    const totalTokens = completion.usage?.total_tokens || 0;

    // Check and update quota
    const quotaResult = await checkAndUpdateQuota(user.id, totalTokens);
    
    if (quotaResult.error) {
      return NextResponse.json(
        { error: quotaResult.error },
        { status: 403 }
      );
    }

    return NextResponse.json({
      content: completion.choices[0].message.content,
      remainingTokens: quotaResult.remainingTokens
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    // Handle specific OpenAI API errors
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to get response from AI" },
      { status: 500 }
    );
  }
} 