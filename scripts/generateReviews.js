import 'dotenv/config';
import { supabase } from '../libs/supabase.js';
import { sendOpenAi } from '../libs/gpt.js';

export const generateReview = async () => {
  // Use specific survey ID 69
  const surveyId = 69;

  // Generate review using GPT
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that generates realistic user reviews for a product. Generate reviews that vary in sentiment (positive, negative, neutral) and include specific details about features, usability, and suggestions for improvement."
    },
    {
      role: "user",
      content: "Generate a realistic user review for a product. Include: 1) A name for the reviewer, 2) Detailed review content, 3) Rating (1-5)"
    }
  ];
 
  const reviewContent = await sendOpenAi(messages, 'review-generator', 500, 0.7);
  
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
  const pages = ['home', 'product', 'features', 'pricing', 'about'];
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
    return;
  }

  console.log('Successfully inserted review:', reviewData);
}; 