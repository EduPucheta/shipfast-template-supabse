(function () {
  if (window.FeedbackWidget) return;

  window.FeedbackWidget = {
    init: function ({ projectId }) {
      const loadScript = (src, callback) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
      };

      const loadReact = () =>
        loadScript("https://unpkg.com/react@18/umd/react.production.min.js", loadReactDOM);
      const loadReactDOM = () =>
        loadScript("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js", renderWidget);

      const renderWidget = () => {
        if (!window.React || !window.ReactDOM || !window.FeedbackWidgetComponent) {
          console.error("Dependencies not loaded");
          return;
        }

        const widgetContainer = document.createElement("div");
        widgetContainer.id = "feedback-widget";
        document.body.appendChild(widgetContainer);

        window.ReactDOM.createRoot(widgetContainer).render(
          window.React.createElement(window.FeedbackWidgetComponent, { projectId })
        );
      };

      if (!window.React || !window.ReactDOM) {
        loadReact();
      } else {
        renderWidget();
      }
    },
  };
})();
