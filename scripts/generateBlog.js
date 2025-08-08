import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Parser from "rss-parser";
import matter from "gray-matter";
import slugify from "slugify";
import { sendOpenAi } from "../libs/gpt.js";
import OpenAI from "openai";

dotenv.config();

const ROOT = path.resolve("/workspace");
const CONTENT_DIR = path.join(ROOT, "content", "posts");
const PUBLIC_DIR = path.join(ROOT, "public", "blog");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function formatDate(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function fetchNewsItems() {
  const parser = new Parser();
  // Google News RSS for the query "feedback collection" and AI
  const url = "https://news.google.com/rss/search?q=%22feedback%20collection%22%20AI%20OR%20%22user%20feedback%22%20OR%20%22customer%20feedback%22%20%2B%20(artificial%20intelligence%20OR%20AI%20OR%20LLM%20OR%20machine%20learning)&hl=en-US&gl=US&ceid=US:en";
  try {
    const feed = await parser.parseURL(url);
    const items = (feed.items || []).slice(0, 8).map((i) => ({
      title: i.title,
      link: i.link,
      pubDate: i.pubDate || i.isoDate || null,
      contentSnippet: i.contentSnippet || i.content || "",
      source: i.creator || i.author || i.source || "",
    }));
    return items;
  } catch (e) {
    console.error("Failed to fetch RSS:", e.message);
    return [];
  }
}

function buildPromptFromNews(items) {
  const newsBullets = items.map((it, idx) => `- [${idx + 1}] ${it.title}\n  Link: ${it.link}\n  Date: ${it.pubDate || ""}\n  Snippet: ${it.contentSnippet || ""}`).join("\n\n");
  const today = formatDate();
  return `You are a senior content strategist writing for a SaaS blog focused on feedback collection, product research, and AI.

Write a high-quality weekly news roundup style blog post based on the curated links below. Target readers are product managers, UX researchers, founders. Tone: practical, concise, insightful. Avoid hype. Prefer concrete takeaways and frameworks.

Constraints:
- 1200-1600 words. Use clear section headings (###) and short paragraphs.
- Include a compelling title (under 70 chars) and a 1-2 sentence summary/excerpt.
- Add a brief "Why it matters" sub-section for each major item.
- Include a short actionable checklist at the end.
- Use only information implied by the links or common knowledge; do not fabricate specifics.
- Return ONLY a minified JSON object with keys: title, excerpt, slug, tags, image_prompt, content_markdown.
- slug must be URL-safe, lowercase, hyphenated.
- tags should be an array of 3-6 tags.
- content_markdown must be valid Markdown, using only standard Markdown, no HTML except links.

Curated links (most recent to oldest):\n\n${newsBullets}\n\nToday: ${today}`;
}

async function generatePostFromNews() {
  const items = await fetchNewsItems();
  if (items.length === 0) {
    throw new Error("No news items found for the query.");
  }
  const prompt = buildPromptFromNews(items);

  const messages = [
    { role: "system", content: "Output valid JSON only. Do not include backticks or extra text." },
    { role: "user", content: prompt },
  ];

  const raw = await sendOpenAi(messages, "cron-blog", 2200, 0.7);
  if (!raw) throw new Error("OpenAI returned no content");

  let data;
  try {
    const fixed = raw.trim().replace(/^```(json)?/i, "").replace(/```$/i, "");
    data = JSON.parse(fixed);
  } catch (e) {
    console.error("Failed to parse JSON from model:", raw);
    throw e;
  }

  // Build dated slug
  const datePrefix = formatDate();
  const safeSlug = slugify(data.slug || data.title || `feedback-ai-${datePrefix}`, {
    lower: true,
    strict: true,
    trim: true,
  });
  const slug = `${datePrefix}-${safeSlug}`;

  // Prepare paths
  ensureDir(CONTENT_DIR);
  ensureDir(PUBLIC_DIR);
  const postDir = path.join(PUBLIC_DIR, slug);
  ensureDir(postDir);
  const coverPathPublic = `/blog/${slug}/cover.png`;
  const coverPathDisk = path.join(postDir, "cover.png");

  // Generate image
  const imagePrompt = `${data.image_prompt || data.title} — editorial, minimalist, modern, vector or photo style, product and research aesthetics, soft gradients, high contrast focal point, 16:9`;
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set. Skipping image generation.");
  } else {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const res = await client.images.generate({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "1024x576",
        quality: "high",
      });
      const b64 = res.data?.[0]?.b64_json;
      if (b64) {
        const buf = Buffer.from(b64, "base64");
        fs.writeFileSync(coverPathDisk, buf);
      }
    } catch (e) {
      console.error("Image generation failed:", e.message);
    }
  }

  // Compose front matter
  const fm = {
    title: data.title,
    date: new Date().toISOString(),
    excerpt: data.excerpt,
    slug,
    tags: Array.isArray(data.tags) ? data.tags : ["AI", "feedback"],
    cover: coverPathPublic,
  };

  const mdBody = data.content_markdown || "";
  const fileContent = matter.stringify(mdBody, fm);

  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, fileContent, "utf8");
  return { slug, filePath };
}

(async () => {
  try {
    const result = await generatePostFromNews();
    console.log("Generated post:", result);
  } catch (e) {
    console.error("Blog generation failed:", e);
    process.exitCode = 1;
  }
})();