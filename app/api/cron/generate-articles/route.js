import { generateArticle } from '../../../../scripts/generateArticles.js';

export async function GET(request) {
  // Verify that the request comes from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await generateArticle();
    return new Response('Article generated successfully', { status: 200 });
  } catch (error) {
    console.error('Error generating article:', error);
    return new Response('Error generating article', { status: 500 });
  }
}
