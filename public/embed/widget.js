(function () {
    if (window.ManGosWidget) return; // Para evitar que se cargue dos veces
  
    window.ManGosWidget = {
      init: function ({ apiKey, projectId }) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.man-gos.com/embed/iframe.html?apiKey=${apiKey}&projectId=${projectId}`;
        iframe.style.border = "none";
        iframe.style.width = "100%";
        iframe.style.height = "400px";
        iframe.style.maxWidth = "500px";
        iframe.style.position = "fixed";
        iframe.style.bottom = "20px";
        iframe.style.right = "20px";
        iframe.style.zIndex = "9999";
  
        document.body.appendChild(iframe);
      },
    };
  })();
  