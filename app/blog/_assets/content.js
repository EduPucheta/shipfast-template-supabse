import eduImg from "@/app/blog/_assets/images/authors/edu.jpg";
import { article as introducingSupabaseArticle } from "@/app/blog/_content/articles/introducing-supabase.js";
import { article as introducingSupabase2Article } from "@/app/blog/_content/articles/introducing-supabase2.js";
import { article as introducingSupabase3Article } from "@/app/blog/_content/articles/introducing-supabase3.js";
import { article as integratingaiwithuserfeedbacksystemsArticle } from "@/app/blog/_content/articles/integrating-ai-with-user-feedback-systems-20250811.js";
import { article as integratingaiinuserfeedbacksystemsArticle } from "@/app/blog/_content/articles/integrating-ai-in-user-feedback-systems-20250811.js";

// ==================================================================================================================================================================
// BLOG CATEGORIES 🏷️
// ==================================================================================================================================================================

// These slugs are used to generate pages in the /blog/category/[categoryI].js. It's a way to group articles by category.
const categorySlugs = {
  feature: "feature",
  tutorial: "tutorial",
};

// All the blog categories data display in the /blog/category/[categoryI].js pages.
export const categories = [
  {
    // The slug to use in the URL, from the categorySlugs object above.
    slug: categorySlugs.feature,
    // The title to display the category title (h1), the category badge, the category filter, and more. Less than 60 characters.
    title: "New Features",
    // A short version of the title above, display in small components like badges. 1 or 2 words
    titleShort: "Features",
    // The description of the category to display in the category page. Up to 160 characters.
    description:
      "Here are the latest features we've added to ShipFast. I'm constantly improving our product to help you ship faster.",
    // A short version of the description above, only displayed in the <Header /> on mobile. Up to 60 characters.
    descriptionShort: "Latest features added to ShipFast.",
  },
  {
    slug: categorySlugs.tutorial,
    title: "How Tos & Tutorials",
    titleShort: "Tutorials",
    description:
      "Learn how to use ShipFast with these step-by-step tutorials. I'll show you how to ship faster and save time.",
    descriptionShort:
      "Learn how to use ShipFast with these step-by-step tutorials.",
  },
];

// ==================================================================================================================================================================
// BLOG AUTHORS 📝
// ==================================================================================================================================================================

// Social icons used in the author's bio.
const socialIcons = {
  twitter: {
    name: "Twitter",
    svg: (
      <svg
        version="1.1"
        id="svg5"
        x="0px"
        y="0px"
        viewBox="0 0 1668.56 1221.19"
        className="w-9 h-9"
        // Using a dark theme? ->  className="w-9 h-9 fill-white"
      >
        <g id="layer1" transform="translate(52.390088,-25.058597)">
          <path
            id="path1009"
            d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99   h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"
          />
        </g>
      </svg>
    ),
  },
  linkedin: {
    name: "LinkedIn",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        // Using a dark theme? ->  className="w-6 h-6 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
    ),
  },
  github: {
    name: "GitHub",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        // Using a dark theme? ->  className="w-6 h-6 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
};

// These slugs are used to generate pages in the /blog/author/[authorId].js. It's a way to show all articles from an author.
const authorSlugs = {
  marc: "marc",
};

// All the blog authors data display in the /blog/author/[authorId].js pages.
export const authors = [
  {
    // The slug to use in the URL, from the authorSlugs object above.
    slug: authorSlugs.marc,
    // The name to display in the author's bio. Up to 60 characters.
    name: "Edu Pucheta",
    // The job to display in the author's bio. Up to 60 characters.
    job: "Maker of Feedbackito",
    // The description of the author to display in the author's bio. Up to 160 characters.
    description:
      "Edu is a developer and an entrepreneur. He is building AI start-ups and helping other people build their products.",
    // The avatar of the author to display in the author's bio and avatar badge. It's better to use a local image, but you can also use an external image (https://...)
    avatar: eduImg,
    // A list of social links to display in the author's bio.
    socials: [
      {
        name: socialIcons.linkedin.name,
        icon: socialIcons.linkedin.svg,
        url: "https://www.linkedin.com/in/eduardopucheta",
      }
    ],
  },
];

// ==================================================================================================================================================================
// BLOG ARTICLES 📚
// ==================================================================================================================================================================

// All the blog articles data display in the /blog/[articleId].js pages.
export const articles = [
  {
    ...introducingSupabaseArticle,

    // Map the string author back to the author object
    author: authors.find((author) => author.slug === introducingSupabaseArticle.author),
  },
  {
    ...introducingSupabase2Article,
    // Map the string category back to the category object

    // Map the string author back to the author object
    author: authors.find((author) => author.slug === introducingSupabase2Article.author),
  },
  {
    ...introducingSupabase3Article,
    // Map the string category back to the category object
    categories: introducingSupabase3Article.categories.map(categorySlug => 
      categories.find((category) => category.slug === categorySlug)
    ),
    // Map the string author back to the author object
    author: authors.find((author) => author.slug === introducingSupabase3Article.author),
  },

  {
    ...integratingaiwithuserfeedbacksystemsArticle,
    // Map the string category back to the category object

    // Map the string author back to the author object
    author: authors.find((author) => author.slug === integratingaiwithuserfeedbacksystemsArticle.author),
  },

  {
    ...integratingaiinuserfeedbacksystemsArticle,

    // Map the string author back to the author object
    author: authors.find((author) => author.slug === integratingaiinuserfeedbacksystemsArticle.author),
  },
];
