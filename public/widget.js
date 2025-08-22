(function () {
  const currentScript = document.currentScript;
  const spaceId = currentScript.src.split('space_id=')[1];

  // Dynamically determine the base URL based on the current script's source
  const scriptUrl = new URL(currentScript.src);
  const baseUrl = `${scriptUrl.protocol}//${scriptUrl.host}`;

  // Create a list of allowed origins including both www and non-www versions
  const allowedOrigins = [
    baseUrl,
    baseUrl.replace('www.', ''),
    baseUrl.replace('//', '//www.')
  ].filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicates

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
      return 'Unknown';
    }
  };

  // Function to apply positioning based on position setting
  const applyPositioning = (iframe, position) => {
    iframe.style.position = 'fixed';
    iframe.style.border = 'none';
    iframe.style.transition = 'height 0.3s ease, width 0.3s ease';
    iframe.style.zIndex = '9999';
    iframe.style.overflow = 'hidden';

    if (position === 'lateral-right') {
      // Position on the right side, centered vertically with vertical tab styling
      iframe.style.right = '0px';
      iframe.style.top = '50%';
      iframe.style.transform = 'translateY(-50%)';
      iframe.style.bottom = 'auto';
      iframe.style.width = '40px';
      iframe.style.height = '120px';
      iframe.style.borderRadius = '0px';
    } else {
      // Default bottom-right positioning
      iframe.style.bottom = '20px';
      iframe.style.right = '20px';
      iframe.style.top = 'auto';
      iframe.style.transform = 'none';
      iframe.style.width = '124px';
      iframe.style.height = '40px';
      iframe.style.borderRadius = '20px';
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
    iframe.scrolling = 'no';
    
    // Apply default positioning - the widget will update this once it loads
    iframe.dataset.position = 'bottom-right';
    applyPositioning(iframe, 'bottom-right');

    document.body.appendChild(iframe);

    // Listen for position updates from the widget
    window.addEventListener('message', (event) => {
      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data.type === 'update-position') {
        // Update positioning when widget sends position info
        iframe.dataset.position = event.data.position;
        applyPositioning(iframe, event.data.position);
      } else if (event.data.type === 'expand-widget') {
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
      
      // Get current position to determine button dimensions
      const currentPosition = iframe.dataset.position || 'bottom-right';
      
      if (currentPosition === 'lateral-right') {
        iframe.style.width = '40px';
        iframe.style.height = '120px';
      } else {
        iframe.style.width = '124px';
        iframe.style.height = '40px';
      }
    }
  };

  // Start the widget initialization
  initializeWidget();
})(); 