(function () {
  if (window.FeedbackWidget) return;

  window.FeedbackWidget = {
    init: function ({ projectId }) {
      if (!projectId) {
        console.error("FeedbackWidget: Missing projectId");
        return;
      }

      const loadScript = (src, callback) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          console.log(`Script ${src} already loaded.`);
          return callback();
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = callback;
        script.onerror = () => console.error(`Failed to load ${src}`);
        document.head.appendChild(script);
      };

      const checkDependencies = () => {
        return window.React && window.ReactDOM && window.FeedbackWidgetComponent;
      };

      const waitForDependencies = (callback, retries = 10) => {
        if (checkDependencies()) {
          console.log("All dependencies loaded.");
          return callback();
        }
        if (retries <= 0) {
          console.error("Dependencies not loaded after multiple attempts.");
          return;
        }
        setTimeout(() => waitForDependencies(callback, retries - 1), 500);
      };

      const renderWidget = () => {
        waitForDependencies(() => {
          console.log("Rendering widget...");
          const widgetContainer = document.createElement("div");
          widgetContainer.id = "feedback-widget";
          document.body.appendChild(widgetContainer);

          window.ReactDOM.createRoot(widgetContainer).render(
            window.React.createElement(window.FeedbackWidgetComponent, { projectId })
          );
        });
      };

      const loadReactDOM = () => {
        if (window.ReactDOM) return renderWidget();
        loadScript(
          "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
          renderWidget
        );
      };

      const loadReact = () => {
        if (window.React) return loadReactDOM();
        loadScript("https://unpkg.com/react@18/umd/react.production.min.js", loadReactDOM);
      };

      if (checkDependencies()) {
        renderWidget();
      } else {
        loadReact();
      }
    },
  };
})();
