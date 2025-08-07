(function () {
  const currentScript = document.currentScript;
  const spaceId = currentScript.src.split('space_id=')[1];

  // Dynamically determine the base URL based on the current script's source
  const scriptUrl = new URL(currentScript.src);
  const baseUrl = `${scriptUrl.protocol}//${scriptUrl.host}`;

  // Detect device type from parent window
  const detectDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Function to detect country using IP geolocation
  const detectCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_name || 'Unknown';
    } catch (error) {
      console.log('Could not detect country:', error);
      return 'Unknown';
    }
  };

  // Initialize widget with country detection
  const initializeWidget = async () => {
    const country = await detectCountry();
    
    const iframe = document.createElement('iframe');
    const widgetUrl = new URL(`${baseUrl}/widjet`);
    
    widgetUrl.searchParams.set('pageUrl', window.location.href);
    widgetUrl.searchParams.set('browser', navigator.userAgent);
    widgetUrl.searchParams.set('parentOrigin', window.location.origin);
    widgetUrl.searchParams.set('space_id', spaceId);
    widgetUrl.searchParams.set('deviceType', detectDeviceType());
    widgetUrl.searchParams.set('country', country);
    
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

    // If widget reports zero height, collapse iframe completely
    function collapseIframe() {
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.pointerEvents = 'none';
      iframe.style.opacity = '0';
    }
    function expandToButton() {
      iframe.style.pointerEvents = '';
      iframe.style.opacity = '1';
      iframe.style.width = '124px';
      iframe.style.height = '40px';
    }

    window.addEventListener('message', (event) => {
      if (event.origin !== baseUrl) return;

      if (event.data.type === 'expand-widget') {
        iframe.style.width = '350px';
        iframe.style.height = '366px';
      } else if (event.data.type === 'collapse-widget') {
        expandToButton();
      } else if (event.data.type === 'widget-height-change') {
        const newHeight = Number(event.data.height) || 0;
        if (newHeight <= 0) {
          collapseIframe();
        } else {
          expandToButton();
          iframe.style.height = `${newHeight}px`;
        }
      }
    });
  };

  // Start the widget initialization
  initializeWidget();
})(); 