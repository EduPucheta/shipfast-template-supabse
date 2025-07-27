# Domain-Specific Widget Targeting Implementation

## Overview
This implementation adds domain-specific targeting functionality to the feedback widget system, allowing different surveys to appear on different websites using the same tracking code.

## Changes Made

### 1. Widget Logic Updates (`app/widjet/page.js`)
- **Enhanced survey fetching**: Modified `fetchActiveSurvey()` to filter surveys based on the current domain
- **Domain extraction**: Added logic to extract domain from the `pageUrl` parameter
- **Smart matching**: Implemented flexible domain matching that supports:
  - Exact domain matches (`example.com`)
  - Subdomain matching (`*.example.com`)
  - Full URL matching (`https://example.com/page`)
  - Fallback behavior for backward compatibility

### 2. Survey Creation Interface (`components/CreateSurvey.js`)
- **Updated targeting UI**: Changed "Pages or events" to "Website Targeting" for clarity
- **Improved validation**: Updated error messages to reflect domain targeting
- **Enhanced examples**: Added helpful examples showing different targeting formats
- **Visual improvements**: Added informational alert with targeting examples

### 3. Configuration Page (`app/dashboard/configuration/page.js`)
- **Better instructions**: Updated tracking code setup instructions
- **Domain explanation**: Added comprehensive info box explaining how domain targeting works
- **Multi-website support**: Clarified that the same code can be used across multiple websites

### 4. Survey Details Display (`components/SurveyDetailsDisplay.js`)
- **Clearer targeting info**: Updated to show "Website Targeting" instead of "Target Pages"
- **Visual indicators**: Added color-coded display for different targeting types
- **Better labeling**: Improved labels to reflect domain-based targeting

### 5. Documentation Updates (`README.md`)
- **Domain targeting section**: Added comprehensive documentation about domain targeting
- **Multiple survey explanation**: Documented how multiple surveys work with domain targeting
- **Examples**: Provided clear examples of different targeting formats

### 6. Testing Infrastructure
- **Test page**: Created `public/test-domain-widget.html` for testing domain targeting
- **Real-time monitoring**: Added widget status monitoring and domain information display
- **Debug features**: Included cleanup and reload functions for testing

## How It Works

### Domain Matching Logic
1. **Extract domain** from the page URL where the widget is loaded
2. **Query all active surveys** from the database
3. **Filter surveys** based on targeting configuration:
   - If `targeting_type === 'all_pages'`: Survey matches any domain
   - If `targeting_type === 'specific_pages'`: Check if current domain matches any `target_urls`
4. **Return the first matching survey** (most recently created)

### Matching Rules
- **Subdomain support**: `example.com` matches `www.example.com`, `shop.example.com`, etc.
- **Exact matches**: `www.example.com` only matches `www.example.com`
- **URL paths**: `https://example.com/shop` matches specific pages
- **Flexible formats**: Supports domains with/without protocols

### Database Schema
Uses existing `surveys` table fields:
- `targeting_type`: 'all_pages' | 'specific_pages'
- `target_urls`: Array of domains/URLs to match
- `is_active`: Boolean to enable/disable surveys

## Benefits

### For Users
1. **Single tracking code**: Use the same code across multiple websites
2. **Targeted surveys**: Different surveys for different websites/audiences
3. **Easy management**: Configure targeting through the dashboard
4. **Flexible targeting**: Support for domains, subdomains, and specific pages

### For Administrators
1. **Better organization**: Separate surveys for different properties
2. **Audience segmentation**: Target specific user groups by website
3. **A/B testing**: Test different surveys on different domains
4. **Scalability**: Manage multiple websites from one dashboard

## Testing the Implementation

### Basic Test
1. Create a survey with "All websites" targeting
2. Install tracking code on any website
3. Verify widget appears

### Domain-Specific Test
1. Create a survey with "Specific websites" targeting
2. Add `localhost` to the target domains
3. Open `http://localhost:3000/test-domain-widget.html`
4. Verify widget appears

### Multi-Domain Test
1. Create Survey A targeting `domain1.com`
2. Create Survey B targeting `domain2.com`
3. Install same tracking code on both domains
4. Verify different surveys appear on different domains

## Migration Notes

### Backward Compatibility
- Existing surveys continue to work without changes
- Default behavior for surveys without domain targeting remains the same
- No database migration required

### Configuration
- Admin users should review and configure domain targeting for existing surveys
- Use "All websites" for surveys that should appear everywhere
- Use "Specific websites" for targeted surveys

## Future Enhancements

### Potential Additions
1. **Advanced matching**: Regex support for complex URL patterns
2. **Geographic targeting**: Combine domain targeting with location
3. **Time-based targeting**: Show different surveys at different times
4. **User behavior targeting**: Target based on user actions or page views
5. **Analytics integration**: Track survey performance by domain

### Performance Optimizations
1. **Client-side caching**: Cache domain targeting rules
2. **API optimization**: Reduce survey queries for repeated visits
3. **Background updates**: Update targeting rules without page reload

## Security Considerations

### Current Implementation
- Domain extraction uses browser's built-in URL parsing
- No sensitive data exposed to client-side
- Surveys fetched server-side with proper validation

### Best Practices
- Validate domain formats on survey creation
- Sanitize URL inputs to prevent XSS
- Consider rate limiting for survey fetching API
- Monitor for suspicious domain targeting patterns

This implementation provides a robust foundation for domain-specific widget targeting while maintaining simplicity and backward compatibility.