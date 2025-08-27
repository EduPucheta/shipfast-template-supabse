/**
 * Detects the browser name from a user agent string
 * @param {string} userAgent - The user agent string
 * @returns {string} - The browser name
 */
export function detectBrowserName(userAgent) {
  if (!userAgent) return 'Unknown';

  const ua = userAgent.toLowerCase();

  // Check for Edge first (before Chrome, since Edge includes "chrome" in UA)
  if (ua.includes('edg/') || ua.includes('edge/')) {
    return 'Microsoft Edge';
  }
  
  // Check for Chrome (must be before Safari, since Chrome includes "safari" in UA)
  if (ua.includes('chrome/') && !ua.includes('edg')) {
    return 'Chrome';
  }
  
  // Check for Firefox
  if (ua.includes('firefox/')) {
    return 'Firefox';
  }
  
  // Check for Safari (must be after Chrome check)
  if (ua.includes('safari/') && !ua.includes('chrome/')) {
    return 'Safari';
  }
  
  // Check for Opera
  if (ua.includes('opera/') || ua.includes('opr/')) {
    return 'Opera';
  }
  
  // Check for Internet Explorer
  if (ua.includes('msie') || ua.includes('trident/')) {
    return 'Internet Explorer';
  }
  
  // Check for other browsers
  if (ua.includes('vivaldi/')) {
    return 'Vivaldi';
  }
  
  if (ua.includes('brave/')) {
    return 'Brave';
  }
  
  if (ua.includes('samsung')) {
    return 'Samsung Internet';
  }
  
  // Default fallback
  return 'Unknown Browser';
}

/**
 * Gets the current browser name (client-side only)
 * @returns {string} - The browser name
 */
export function getCurrentBrowserName() {
  if (typeof navigator === 'undefined') return 'Unknown';
  return detectBrowserName(navigator.userAgent);
}
