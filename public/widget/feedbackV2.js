// embed-form.js (to be served from your Next.js project's /public directory or an API route)

(function() {
  function embedForm(options) {
    const targetElementId = options.targetId || 'embedded-form'; // Default ID
    const formUrl = options.formUrl; // URL of your Next.js form page

    if (!formUrl) {
      console.error('Form URL is required.');
      return;
    }

    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) {
      console.error(`Target element with ID '${targetElementId}' not found.`);
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = formUrl;
    iframe.style.width = '100%';
    iframe.style.height = '500px'; // Adjust as needed
    iframe.style.border = 'none';

    targetElement.appendChild(iframe);
  }

  // Expose the embedForm function globally
  window.embedForm = embedForm;
})();