import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_DIR = path.resolve("/workspace/content/posts");

function getAllSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

async function getPostBySlug(slug) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();
  return { data, contentHtml };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const { data, contentHtml } = await getPostBySlug(slug);
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {data.cover && <img src={data.cover} alt="cover" className="w-full rounded-lg mb-6" />}
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{new Date(data.date).toLocaleDateString()}</p>
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}