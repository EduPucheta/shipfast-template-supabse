(function () {
    window.onload = function () {
      const iframe = document.createElement("iframe");
      iframe.src = "http://localhost:3000/widjet"; // Your widget URL
      iframe.width = "50%" ;
      iframe.height = "50%";
      iframe.style.border = "none";
      iframe.style.position = "fixed";
      iframe.style.right = "20px";
      iframe.style.top = "50%";
      iframe.style.transform = "translateY(-50%)";
      iframe.style.zIndex = "9999";
      iframe.allow = "clipboard-write"; // Optional permissions
      window.parent.document.body.appendChild(iframe);
      console.log("Widget Loaded ✅");
    };
  })();
  