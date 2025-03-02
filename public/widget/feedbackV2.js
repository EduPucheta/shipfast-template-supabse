(function () {
    if (window.FeedbackWidget) return;
  
    window.FeedbackWidget = {
      init: function ({ projectId }) {
        const script = document.createElement("script");
        script.src = "https://shipfast-template-supabse-k6pc-ck6if5etl-edupuchetas-projects.vercel.app/widget/widjetV2.js"; // Adjust path
        document.head.appendChild(script);
  
        script.onload = () => {
          const widget = document.createElement("div");
          widget.id = "feedback-widget";
          document.body.appendChild(widget);
  
          ReactDOM.render(
            React.createElement(FeedbackWidget, { projectId }),
            widget
          );
        };
      },
    };
  })();
  