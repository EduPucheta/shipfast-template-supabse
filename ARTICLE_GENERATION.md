# AI Article Generation Cron Job

This cron job automatically generates blog articles about "User Feedback + AI" using the OpenAI API.

## Overview

The cron job is set up to run weekly (every Sunday at midnight) and creates comprehensive articles about AI and user feedback integration topics.

## Files Created

### Cron Job Configuration
- `app/api/cron/generate-articles/route.js` - Main cron endpoint
- `app/api/cron/generate-articles/route-segment.config.js` - Cron schedule configuration

### Scripts
- `scripts/generateArticles.js` - Main article generation logic
- `scripts/testArticleGeneration.js` - Test script for manual testing

## How It Works

1. **Scheduled Execution**: The cron job runs weekly (Sundays at midnight)
2. **Content Generation**: Uses OpenAI GPT-4o-mini to generate comprehensive articles
3. **File Creation**: Creates new article files in `app/blog/_content/articles/`
4. **Auto-Registration**: Automatically updates `app/blog/_assets/content.js` to include new articles

## Article Topics

The AI generates articles covering:
- AI-powered feedback analysis
- Automated sentiment analysis
- Smart categorization of user feedback
- AI-driven insights from user data
- Machine learning for product improvement
- Best practices for implementing AI in feedback systems

## Configuration

### Environment Variables Required
- `OPENAI_API_KEY` - Your OpenAI API key (get from [OpenAI Platform](https://platform.openai.com/account/api-keys))
- `CRON_SECRET` - Secret for authenticating cron requests

### Environment Setup

The article generation scripts are configured to load environment variables from `.env.local` file. This is the standard Next.js practice for local development.

1. **Ensure your `.env.local` file** contains:
```env
# OpenAI API Key for article generation
OPENAI_API_KEY=sk-your-actual-api-key-here

# Cron Secret for scheduled tasks
CRON_SECRET=your-cron-secret-here
```

2. **Environment files are automatically ignored** by Git for security:
```gitignore
# Environment variables (already in .gitignore)
.env
.env.local
.env.*.local
```

**Note:** The scripts have been updated to automatically load from `.env.local` using the `dotenv` package.

### Cron Schedule
Currently set to run weekly (`0 0 * * 0`). You can modify this in `route-segment.config.js`:
- Every hour: `0 * * * *`
- Daily at midnight: `0 0 * * *`
- Weekly (current): `0 0 * * 0`

## Manual Testing

You can test the article generation manually:

```bash
npm run test-article-generation
```

Or call the cron endpoint directly:
```bash
curl -X GET "http://localhost:3000/api/cron/generate-articles" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Article Structure

Generated articles include:
- **Title**: SEO-optimized (max 60 characters)
- **Description**: Meta description (max 160 characters)
- **Slug**: URL-friendly identifier
- **Content**: Comprehensive HTML content with proper styling
- **Categories**: Auto-assigned to "tutorial" or "feature"
- **Author**: Set to "marc" (configurable)
- **Published Date**: Current date

## File Naming

Articles are saved with the format: `{slug}-{YYYYMMDD}.js`

Example: `ai-feedback-analysis-20241201.js`

## Customization

To modify the article generation:

1. **Change Topics**: Edit the system prompt in `scripts/generateArticles.js`
2. **Adjust Schedule**: Modify `route-segment.config.js`
3. **Update Author**: Change the author field in the article template
4. **Modify Categories**: Update the categories array in the generation logic

## Troubleshooting

### Common Error Messages

**"❌ OpenAI API key is not configured!"**
- **Solution**: Create a `.env` file and add your `OPENAI_API_KEY`
- **Steps**: Follow the Environment Setup section above

**"401 Incorrect API key provided: undefined"**
- **Solution**: Your API key is not being loaded correctly
- **Check**: Ensure the `.env` file is in the root directory and contains a valid API key

**"MODULE_TYPELESS_PACKAGE_JSON Warning"**
- **Solution**: This warning has been fixed by adding `"type": "module"` to `package.json`

### Other Issues

- **OpenAI API Errors**: Check your API key and quota limits
- **File Permission Errors**: Ensure write permissions to the articles directory
- **Cron Authentication**: Verify `CRON_SECRET` is correctly set
- **JSON Parsing Errors**: The AI response might not be valid JSON - check logs

### Verification Steps

1. **Test your setup**:
   ```bash
   npm run test-article-generation
   ```

2. **Expected success output**:
   ```
   Testing article generation...
   Starting article generation...
   Ask GPT >>>
   Successfully created article: [filename]
   ✅ Article generation test completed successfully
   ```

## Security

- The cron endpoint is protected by the `CRON_SECRET` environment variable
- Only authorized requests from Vercel Cron can trigger article generation
- Generated content is sanitized and follows the existing article pattern
