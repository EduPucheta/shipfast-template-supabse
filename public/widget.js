(function () {
  const currentScript = document.currentScript;
  const spaceId = currentScript.src.split('space_id=')[1];

  // Dynamically determine the base URL based on the current script's source
  const scriptUrl = new URL(currentScript.src);
  const baseUrl = `${scriptUrl.protocol}//${scriptUrl.host}`;

  const iframe = document.createElement('iframe');
  const widgetUrl = new URL(`${baseUrl}/widjet`);
  
  widgetUrl.searchParams.set('pageUrl', window.location.href);
  widgetUrl.searchParams.set('browser', navigator.userAgent);
  widgetUrl.searchParams.set('parentOrigin', window.location.origin);
  widgetUrl.searchParams.set('space_id', spaceId);
  
  iframe.src = widgetUrl.toString();
  iframe.scrolling = 'no'; // Disable scrollbars
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.border = 'none';
  iframe.style.width = '124px';
  iframe.style.height = '40px';   
  iframe.style.transition = 'height 0.3s ease, width 0.3s ease';
  iframe.style.zIndex = '9999';
  iframe.style.borderRadius = '20px';
 // iframe.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  iframe.style.overflow = 'hidden'; // Additional CSS to ensure no scrollbars

  document.body.appendChild(iframe);

  window.addEventListener('message', (event) => {
    if (event.origin !== baseUrl) return;

    if (event.data.type === 'expand-widget') {
      iframe.style.width = '350px';
      iframe.style.height = '366px';
    } else if (event.data.type === 'collapse-widget') {
      iframe.style.width = '124px';
      iframe.style.height = '40px';
    } else if (event.data.type === 'widget-height-change') {
      iframe.style.height = `${event.data.height}px`;
    }
  });
})(); 