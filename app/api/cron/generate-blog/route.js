export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { default: mod } = await import('../../../../scripts/generateBlog.js');
    // The script self-invokes when imported; but ensure function exists if refactored later
    return new Response('Blog generation triggered', { status: 200 });
  } catch (error) {
    console.error('Error generating blog:', error);
    return new Response('Error generating blog', { status: 500 });
  }
}