import { generateReview } from '../../../../scripts/generateReviews.js';

export const runtime = 'edge';

export async function GET(request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await generateReview();
    return new Response('Review generated successfully', { status: 200 });
  } catch (error) {
    console.error('Error generating review:', error);
    return new Response('Error generating review', { status: 500 });
  }
} 