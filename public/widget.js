(function() {
  // Prevent multiple widget instances
  if (window.feedbackWidgetLoaded || document.getElementById('feedback-widget-container')) {
    return;
  }

  // Prevent widget from loading on its own page
  if (window.location.pathname === '/widjet') {
    return;
  }

  window.feedbackWidgetLoaded = true;

  const scriptTag = document.currentScript;
  const baseUrl = scriptTag ? new URL(scriptTag.src).origin : 'http://localhost:3000';

  const pageUrl = window.location.href;
  const browserInfo = window.navigator.userAgent;
  const parentOrigin = window.location.origin;

  // Create a container for the widget iframe
  const container = document.createElement('div');
  container.id = 'feedback-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(container);

  // Create a single iframe to host the widget
  const iframe = document.createElement('iframe');
  
  // Initial styles for the collapsed button
  const initialStyles = {
    width: '160px',
    height: '70px',
    border: 'none',
    background: 'transparent',
    pointerEvents: 'none',
    borderRadius: '0px'
  };
  Object.assign(iframe.style, initialStyles);

  iframe.src = `${baseUrl}/widjet?parentOrigin=${encodeURIComponent(parentOrigin)}&pageUrl=${encodeURIComponent(pageUrl)}&browser=${encodeURIComponent(browserInfo)}`;
  
  container.appendChild(iframe);

  // Create a backdrop for the expanded view
  const backdrop = document.createElement('div');
  backdrop.id = 'feedback-widget-backdrop';
  Object.assign(backdrop.style, {
    display: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: '9998',
    pointerEvents: 'none'
  });
  
  // Add click handler to backdrop to close widget
  backdrop.addEventListener('click', function(e) {
    if (e.target === backdrop) {
      iframe.contentWindow.postMessage({ type: 'close-widget' }, baseUrl);
    }
  });
  
  document.body.appendChild(backdrop);

  // Store widget state
  let isExpanded = false;
  let isReady = false;

  // Handle messages from the iframe
  window.addEventListener('message', function(event) {
    if (event.origin !== baseUrl) return;

    const { type } = event.data;

    switch (type) {
      case 'widget-ready':
        isReady = true;
        iframe.style.pointerEvents = 'auto';
        container.style.pointerEvents = 'auto';
        break;

      case 'expand-widget':
        if (!isReady) return;
        
        isExpanded = true;
        backdrop.style.display = 'block';
        backdrop.style.pointerEvents = 'auto';
        
        // Move container to center and resize
        Object.assign(container.style, {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bottom: 'auto',
          right: 'auto'
        });
        
        Object.assign(iframe.style, {
          width: '450px',
          height: '350px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        });
        break;

      case 'collapse-widget':
        if (!isReady) return;
        
        isExpanded = false;
        backdrop.style.display = 'none';
        backdrop.style.pointerEvents = 'none';
        
        // Reset container position
        Object.assign(container.style, {
          top: 'auto',
          left: 'auto',
          transform: 'none',
          bottom: '20px',
          right: '20px'
        });
        
        Object.assign(iframe.style, {
          ...initialStyles,
          pointerEvents: 'auto'
        });
        break;

      case 'widget-height-change':
        if (!isExpanded && event.data.height) {
          iframe.style.height = event.data.height + 'px';
        }
        break;
    }
  });

  // Cleanup function for development
  window.cleanupFeedbackWidget = function() {
    document.getElementById('feedback-widget-container')?.remove();
    document.getElementById('feedback-widget-backdrop')?.remove();
    window.feedbackWidgetLoaded = false;
  };

  // Handle page unload
  window.addEventListener('beforeunload', function() {
    window.cleanupFeedbackWidget();
  });
})(); 