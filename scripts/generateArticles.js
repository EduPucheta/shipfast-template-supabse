import { sendOpenAi } from '../libs/gpt.js';
import fs from 'fs';
import path from 'path';

export const generateArticle = async () => {
  console.log('Starting article generation...');

  // Generate article content using GPT
  const messages = [
    {
      role: "system",
      content: `You are an expert technical writer specializing in AI and user feedback systems. Generate a comprehensive blog article about user feedback and AI integration. The article should be educational, practical, and suitable for developers and product managers. 

Structure your response as a JSON object with the following fields:
- title: Article title (max 60 characters)
- description: Article description (max 160 characters)  
- slug: URL-friendly slug (kebab-case)
- content: Main article content in HTML format with proper sections
- categories: Array of category slugs (use "tutorial" or "feature")

Focus on topics like:
- AI-powered feedback analysis
- Automated sentiment analysis
- Smart categorization of user feedback
- AI-driven insights from user data
- Machine learning for product improvement
- Best practices for implementing AI in feedback systems

Make the content actionable and include code examples where appropriate. Use proper HTML structure with h2, h3, p, ul, li, code, and pre tags.`
    },
    {
      role: "user",
      content: "Generate a comprehensive article about 'User Feedback + AI' that covers practical implementation strategies, benefits, and real-world applications. Include specific examples and actionable insights for developers."
    }
  ];

  const articleResponse = await sendOpenAi(messages, 'article-generator', 2000, 0.7);
  
  if (!articleResponse) {
    console.error('Failed to generate article content');
    return;
  }

  let articleData;
  try {
    articleData = JSON.parse(articleResponse);
  } catch (error) {
    console.error('Failed to parse article JSON:', error);
    return;
  }

  // Validate required fields
  if (!articleData.title || !articleData.description || !articleData.slug || !articleData.content) {
    console.error('Missing required article fields');
    return;
  }

  // Generate unique filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const fileName = `${articleData.slug}-${timestamp}.js`;
  const filePath = path.join(process.cwd(), 'app', 'blog', '_content', 'articles', fileName);

  // Create article file content
  const fileContent = `// Auto-generated article about User Feedback + AI
// Generated on: ${new Date().toISOString()}

// These styles are used in the content of the articles. When you update them, all articles will be updated.
const styles = {
  h2: "text-2xl lg:text-4xl font-bold tracking-tight mb-4 text-base-content",
  h3: "text-xl lg:text-2xl font-bold tracking-tight mb-2 text-base-content",
  p: "text-base-content/90 leading-relaxed",
  ul: "list-inside list-disc text-base-content/90 leading-relaxed",
  li: "list-item",
  code: "text-sm font-mono bg-neutral text-neutral-content p-6 rounded-box my-4 overflow-x-scroll select-all",
  codeInline: "text-sm font-mono bg-base-300 px-1 py-0.5 rounded-box select-all",
};

export const article = {
  // The unique slug to use in the URL. It's also used to generate the canonical URL.
  slug: "${articleData.slug}",
  // The title to display in the article page (h1). Less than 60 characters. It's also used to generate the meta title.
  title: "${articleData.title.replace(/"/g, '\\"')}",
  // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
  description: "${articleData.description.replace(/"/g, '\\"')}",
  // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
  categories: ${JSON.stringify(articleData.categories || ["tutorial"])},
  // The author of the article. It's used to generate a link to the author's bio page.
  author: "marc",
  // The date of the article. It's used to generate the meta date.
  publishedAt: "${new Date().toISOString().split('T')[0]}",
  image: {
    // Default image for AI/feedback articles
    src: null,
    urlRelative: "/blog/ai-feedback/header.jpg", 
    alt: "AI and User Feedback Integration",
  },
  // The actual content of the article that will be shown under the <h1> title in the article page.
  content: (
    <>
      ${articleData.content.replace(/className="([^"]*)"/g, (match, className) => {
        // Map HTML classes to our styles object
        if (className.includes('h2')) return 'className={styles.h2}';
        if (className.includes('h3')) return 'className={styles.h3}';
        if (className.includes('p')) return 'className={styles.p}';
        if (className.includes('ul')) return 'className={styles.ul}';
        if (className.includes('li')) return 'className={styles.li}';
        if (className.includes('code-block')) return 'className={styles.code}';
        if (className.includes('code-inline')) return 'className={styles.codeInline}';
        return match;
      }).replace(/<h2>/g, '<h2 className={styles.h2}>').replace(/<h3>/g, '<h3 className={styles.h3}>').replace(/<p>/g, '<p className={styles.p}>').replace(/<ul>/g, '<ul className={styles.ul}>').replace(/<li>/g, '<li className={styles.li}>').replace(/<pre><code>/g, '<pre className={styles.code}><code>').replace(/<code>/g, '<code className={styles.codeInline}>')}
    </>
  ),
};
`;

  try {
    // Ensure the directory exists
    const articlesDir = path.dirname(filePath);
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    // Write the article file
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Successfully created article: ${fileName}`);

    // Update the content.js file to include the new article
    await updateContentIndex(fileName, articleData.slug);
    
    console.log('Article generation completed successfully');
    
  } catch (error) {
    console.error('Error writing article file:', error);
  }
};

async function updateContentIndex(fileName, slug) {
  const contentPath = path.join(process.cwd(), 'app', 'blog', '_assets', 'content.js');
  
  try {
    let contentFile = fs.readFileSync(contentPath, 'utf8');
    
    // Add import statement
    const articleVarName = slug.replace(/-/g, '') + 'Article';
    const importStatement = `import { article as ${articleVarName} } from "@/app/blog/_content/articles/${fileName.replace('.js', '.js')}";`;
    
    // Find where to insert the import (after existing imports)
    const importRegex = /import { article as \w+Article } from[^;]+;/g;
    const imports = contentFile.match(importRegex) || [];
    const lastImport = imports[imports.length - 1];
    
    if (lastImport) {
      const lastImportIndex = contentFile.indexOf(lastImport) + lastImport.length;
      contentFile = contentFile.slice(0, lastImportIndex) + '\n' + importStatement + contentFile.slice(lastImportIndex);
    }
    
    // Add to articles array
    const articleObject = `  {
    ...${articleVarName},
    // Map the string category back to the category object
    categories: ${articleVarName}.categories.map(categorySlug => 
      categories.find((category) => category.slug === categorySlug)
    ),
    // Map the string author back to the author object
    author: authors.find((author) => author.slug === ${articleVarName}.author),
  },`;
    
    // Find the articles array and add the new article
    const articlesArrayRegex = /export const articles = \[([\s\S]*?)\];/;
    const match = contentFile.match(articlesArrayRegex);
    
    if (match) {
      const articlesContent = match[1];
      const newArticlesContent = articlesContent + '\n' + articleObject;
      contentFile = contentFile.replace(articlesArrayRegex, `export const articles = [${newArticlesContent}\n];`);
    }
    
    fs.writeFileSync(contentPath, contentFile, 'utf8');
    console.log('Updated content.js with new article');
    
  } catch (error) {
    console.error('Error updating content.js:', error);
  }
}
