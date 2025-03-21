(function () {
    window.onload = function () {
      const iframe = document.createElement("iframe");
      iframe.src = "http://localhost:3000/widjet"; // Your widget URL
      iframe.width = "1px";
      iframe.height = "1px";
      iframe.style.border = "none";
      iframe.style.position = "fixed";
      iframe.style.right = "20px";
      iframe.style.bottom = "20px";
      iframe.style.zIndex = "9999";
      iframe.style.overflow = "hidden";
      iframe.allow = "clipboard-write"; // Optional permissions
      document.body.appendChild(iframe);

      // Listen for messages from the iframe
      window.addEventListener('message', function(event) {
        // Verify the origin of the message
        if (event.origin !== "http://localhost:3000") return;
        
        // Handle the message
        if (event.data.type === 'surveyLoaded') {
          // The survey component is loaded and ready
          iframe.style.width = "400px";
          iframe.style.height = "600px";
          iframe.style.borderRadius = "8px";
          iframe.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
        }
      });

      console.log("Widget Loaded ✅");
    };
  })();
  