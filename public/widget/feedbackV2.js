(function () {
  if (window.FeedbackWidget) return;

  window.FeedbackWidget = {
    init: function ({ projectId }) {
      const script = document.createElement("script");
      script.src = "https://shipfast-template-supabse-k6pc.vercel.app/widget/widjetV2.js"; // Adjust the path
      document.head.appendChild(script);

      script.onload = () => {
        const widgetContainer = document.createElement("div");
        widgetContainer.id = "feedback-widget";
        document.body.appendChild(widgetContainer);

        // Wait until ReactDOM is available
        if (window.React && window.ReactDOM) {
          window.ReactDOM.createRoot(widgetContainer).render(
            window.React.createElement(window.FeedbackWidgetComponent, { projectId })
          );
        } else {
          console.error("React or ReactDOM is not available.");
        }
      };
    },
  };
})();
