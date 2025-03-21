(function () {
    window.onload = function () {
      const iframe = document.createElement("iframe");
      iframe.src = "http://localhost:3000/widjet"; // Your widget URL
      iframe.style.width = "auto";
      iframe.style.height = "auto";
      iframe.style.border = "none";
      iframe.style.position = "fixed";
      iframe.style.right = "20px";
      iframe.style.top = "50%";
      iframe.style.transform = "translateY(-50%)";
      iframe.style.zIndex = "9999";
      iframe.style.background = "transparent";
      iframe.allow = "clipboard-write"; // Optional permissions
      window.parent.document.body.appendChild(iframe);
      
      // Adjust iframe size after content loads
      iframe.onload = function() {
        const content = iframe.contentWindow.document.body;
        iframe.style.width = content.scrollWidth + "px";
        iframe.style.height = content.scrollHeight + "px";
      };
      
      console.log("Widget Loaded ✅");
    };
  })();
  