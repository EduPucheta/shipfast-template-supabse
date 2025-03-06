(function () {
    if (window.ManGosWidget) return; // Prevent duplicate loading
  
    window.ManGosWidget = {
      init: function ({ apiKey, projectId, theme = 'light' }) {
        document.addEventListener("DOMContentLoaded", function () { // Ensure DOM is ready
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.man-gos.com/embed/iframe.html?apiKey=${apiKey}&projectId=${projectId}&theme=${theme}`;
          iframe.style.border = "none";
          iframe.style.width = "100%";
          iframe.style.height = "400px";
          iframe.style.maxWidth = "500px";
          iframe.style.position = "fixed";
          iframe.style.bottom = "20px";
          iframe.style.right = "20px";
          iframe.style.zIndex = "9999";
          iframe.style.borderRadius = "12px";
          iframe.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
  
          document.body.appendChild(iframe);
        });
      },
    };
  })();