"use client";
import PreviewSurvey from "@/components/PreviewSurvey";

export default function WidgetPage() {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Feedback Widget</title>
        <style>
          {`
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: white;
            }
          `}
        </style>
      </head>
      <body>
        <div id="root">
          <PreviewSurvey />
        </div>
      </body>
    </html>
  );
}
