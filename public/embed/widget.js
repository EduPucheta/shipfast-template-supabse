(function () {
    window.onload = function () {
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.man-gos.com/widget"; // Your widget URL
      iframe.width = "400";
      iframe.height = "500";
      iframe.style.border = "none";
      iframe.style.position = "fixed";
      iframe.style.bottom = "20px";
      iframe.style.right = "20px";
      iframe.style.zIndex = "9999";
      iframe.allow = "clipboard-write"; // Optional permissions
      document.body.appendChild(iframe);
      console.log("Widget Loaded ✅");
    };
  })();
  