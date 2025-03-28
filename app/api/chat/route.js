import OpenAI from "openai";
import { NextResponse } from "next/server";

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

    // Create a system message with survey context
    const systemMessage = {
      role: "system",
      content: `You are a helpful AI assistant that helps users understand their survey responses. 
      You have access to the following survey data: ${JSON.stringify(surveyData)}. 
      Use this data to provide accurate and relevant answers to the user's questions about their survey responses.`
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

    return NextResponse.json({
      content: completion.choices[0].message.content
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