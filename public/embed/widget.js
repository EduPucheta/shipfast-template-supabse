(function () {
    window.onload = function () {
      const iframe = document.createElement("iframe");
      iframe.src = "http://localhost:3000/widjet"; // Your widget URL
      iframe.width = "auto";
      iframe.height = "600px"; // Initial height
      iframe.style.border = "none";
      iframe.style.position = "fixed";
      iframe.style.right = "20px";
      iframe.style.top = "50%";
      iframe.style.transform = "translateY(-50%)";
      iframe.style.zIndex = "9999";
      iframe.allow = "clipboard-write"; // Optional permissions
      document.body.appendChild(iframe);

      // Listen for messages from the iframe
      window.addEventListener('message', function(event) {
        if (event.data.type === 'height') {
          iframe.height = event.data.height + "px";
        }
      });

      console.log("Widget Loaded ✅");
    };
  })();
  