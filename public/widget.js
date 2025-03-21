(function() {
  // Create a container for the widget
  const container = document.createElement('div');
  container.id = 'feedback-widget-container';
  document.body.appendChild(container);

  // Create an iframe to load the widget
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.bottom = '0';
  iframe.style.right = '0';
  iframe.style.width = '40%';
  iframe.style.height = '70%'; 
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  iframe.style.background = 'transparent';
  iframe.style.pointerEvents = 'none';
  
  // Set the source to your widget URL
  iframe.src = 'http://localhost:3000/widjet'; // Replace with your actual widget URL
  
  container.appendChild(iframe);

  // Handle messages from the iframe
  window.addEventListener('message', function(event) {
    // Verify the origin of the message
    if (event.origin !== 'http://localhost:3000') return; // Replace with your actual domain
    
    // Handle widget interactions
    if (event.data.type === 'widget-ready') {
      iframe.style.pointerEvents = 'auto';
    }
  });
})(); 