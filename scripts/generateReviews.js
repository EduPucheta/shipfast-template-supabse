import { supabase } from '../libs/supabase.js';
import { sendOpenAi } from '../libs/gpt.js';

export const generateReview = async () => {
  // Use specific survey ID 69
  const surveyId = 69;

  // Generate review using GPT
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that generates realistic user reviews for digital products. Focus on generating constructive feedback that helps identify bugs, usability issues, and areas for improvement. Reviews should include specific details about: 1) User experience and interface issues, 2) Technical problems or bugs encountered, 3) Feature requests or missing functionality, 4) Performance concerns, and 5) Suggestions for improvement. Maintain a professional and constructive tone while being specific about issues. Don't return any other text than the review. Don't include titles."
    },
    {
      role: "user",
      content: "Generate a realistic user review for a digital product that focuses on constructive feedback. Include: 1) A name for the reviewer, 2) Detailed review content with specific issues or suggestions, 3) Rating (1-5), 4) At least one specific bug or improvement suggestion"
    }
  ];
 
  const reviewContent = await sendOpenAi(messages, 'review-generator', 200, 0.7);
  
  if (!reviewContent) {
    console.error('Failed to generate review');
    return;
  }

  // Parse the review content
  const lines = reviewContent.split('\n');
  const name = lines[0].replace('Name: ', '').trim();
  const review = lines.slice(1).join('\n').trim();
  const rating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5

  // Generate a random page name
  const pages = ['/', '/product', '/features', '/pricing', '/about'];
  const page = pages[Math.floor(Math.random() * pages.length)];

  // Create the review data
  const reviewData = {
    name,
    rating,
    review,
    survey: surveyId,
    page,
    created_at: new Date().toISOString()
  };

  // Insert into Supabase
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData]);

  if (error) {
    console.error('Error inserting review:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return;
  }

  console.log('Successfully inserted review:', reviewData);
}; 