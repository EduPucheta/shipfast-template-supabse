import { supabase } from '../libs/supabase.js';
import { sendOpenAi } from '../libs/gpt.js';

const generateFeedback = async () => {
  // Generate feedback using GPT
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that generates realistic user feedback for a product. Generate feedback that varies in sentiment (positive, negative, neutral) and includes specific details about features, usability, and suggestions for improvement."
    },
    {
      role: "user",
      content: "Generate a realistic user feedback for a product. Include: 1) A title/summary, 2) Detailed feedback, 3) Rating (1-5), 4) User type (e.g., 'Power User', 'New User', 'Business User')"
    }
  ];

  const feedback = await sendOpenAi(messages, 'feedback-generator', 500, 0.7);
  
  if (!feedback) {
    console.error('Failed to generate feedback');
    return;
  }

  // Parse the feedback into structured data
  const feedbackData = {
    title: feedback.split('\n')[0].replace('Title: ', ''),
    content: feedback,
    rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
    user_type: ['Power User', 'New User', 'Business User', 'Casual User'][Math.floor(Math.random() * 4)],
    created_at: new Date().toISOString(),
    status: 'active'
  };

  // Insert into Supabase
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedbackData]);

  if (error) {
    console.error('Error inserting feedback:', error);
    return;
  }

  console.log('Successfully inserted feedback:', feedbackData);
};

// Run the generator
generateFeedback(); 