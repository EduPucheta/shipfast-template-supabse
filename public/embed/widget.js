(function () {
    const iframe = document.createElement("iframe");
    iframe.src = "https://shipfast-template-supabse-k6pc.vercel.app/widget";
    iframe.width = "400";
    iframe.height = "500";
    iframe.style.border = "none";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.zIndex = "9999";
    iframe.allow = "clipboard-write"; // Optional permissions
    document.body.appendChild(iframe);
  })();
  