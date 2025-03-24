(function() {
  // Create a container for the widget
  const container = document.createElement('div');
  container.id = 'feedback-widget-container';
  container.style.position = 'fixed';
  container.style.bottom = '0';
  container.style.right = '0';
  container.style.width = '40%';
  container.style.height = '70%';
  container.style.zIndex = '9999';
  container.style.background = 'transparent';
  container.style.pointerEvents = 'none';
  
  // Create a shadow DOM to isolate our styles
  const shadow = container.attachShadow({ mode: 'open' });
  
  // Create a style element for our widget
  const style = document.createElement('style');
  style.textContent = `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;
  shadow.appendChild(style);
  
  // Create a container for the widget content
  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';
  shadow.appendChild(widgetContent);
  
  // Fetch the widget content
  fetch('http://localhost:3000/widjet')
    .then(response => response.text())
    .then(html => {
      widgetContent.innerHTML = html;
      container.style.pointerEvents = 'auto';
    })
    .catch(error => console.error('Error loading widget:', error));
  
  // Append the container to the body
  document.body.appendChild(container);
})(); 