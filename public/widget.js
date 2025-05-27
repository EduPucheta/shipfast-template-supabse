(function() {
  // Create a container for the widget
  const container = document.createElement('div');
  container.id = 'feedback-widget-container';
  document.body.appendChild(container);

  // Create an iframe to load the widget
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';  
  iframe.style.right = '20px';
  iframe.style.width = '160px'; // Reduced size for just the button
  iframe.style.height = '60px'; // Reduced size for just the button
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  iframe.style.background = 'transparent';
  iframe.style.pointerEvents = 'none';
  
  // Set the source to your widget URL
  iframe.src = 'http://localhost:3000/widjet'; // Replace with your actual widget URL
  
  container.appendChild(iframe);

  // Create a container for the expanded survey
  const expandedContainer = document.createElement('div');
  expandedContainer.id = 'feedback-widget-expanded';
  expandedContainer.style.display = 'none';
  expandedContainer.style.position = 'fixed';
  expandedContainer.style.top = '0';
  expandedContainer.style.left = '0';
  expandedContainer.style.width = '1px';
  expandedContainer.style.height = '1px';
  expandedContainer.style.zIndex = '9998';
  expandedContainer.style.background = 'rgba(0, 0, 0, 0.5)';
  document.body.appendChild(expandedContainer);

  // Handle messages from the iframe
  window.addEventListener('message', function(event) {
    // Verify the origin of the message
    if (event.origin !== 'http://localhost:3000') return; // Replace with your actual domain
    
    // Handle widget interactions
    if (event.data.type === 'widget-ready') {
      iframe.style.pointerEvents = 'auto';
    }
    
    // Handle survey expansion
    if (event.data.type === 'expand-survey') {
      // Create a new iframe for the expanded survey
      const surveyIframe = document.createElement('iframe');
      surveyIframe.style.position = 'fixed';
      surveyIframe.style.top = '50%';
      surveyIframe.style.left = '50%';
      surveyIframe.style.transform = 'translate(-50%, -50%)';
      surveyIframe.style.width = '500px';
      surveyIframe.style.height = '500px';
      surveyIframe.style.border = 'none';
      surveyIframe.style.borderRadius = '8px';
      surveyIframe.style.background = 'unset';
      surveyIframe.style.zIndex = '9999';
      surveyIframe.src = 'http://localhost:3000/widjet?expanded=true';
      
      expandedContainer.appendChild(surveyIframe);
      expandedContainer.style.display = 'block';
    }
    
    // Handle survey collapse
    if (event.data.type === 'collapse-survey') {
      expandedContainer.style.display = 'none';
      expandedContainer.innerHTML = '';
    }
  });
})(); 