import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

const CONTENT_DIR = path.resolve("/workspace/content/posts");

function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const full = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data } = matter(raw);
    return {
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      slug: data.slug,
      cover: data.cover,
    };
  });
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul className="space-y-8">
        {posts.map((p) => (
          <li key={p.slug} className="group">
            <Link href={`/blog/${p.slug}`} className="block">
              {p.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt="cover" className="w-full rounded-lg mb-3" />
              )}
              <h2 className="text-2xl font-semibold group-hover:underline">{p.title}</h2>
              <p className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</p>
              <p className="mt-2 text-gray-700">{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}