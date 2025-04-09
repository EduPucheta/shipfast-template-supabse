'use client';

import { useState } from 'react';

export default function ConfigurationPage() {
  const [isCopied, setIsCopied] = useState(false);

  const trackingCode = `<script>
  window.surveyConfig = {
    projectId: 'YOUR_PROJECT_ID',
    apiKey: 'YOUR_API_KEY',
    environment: 'production'
  };
</script>
<script src="/path/to/survey-script.js" async></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Configuration</h1>

      <div className="grid gap-6">
        {/* Setup Instructions */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Tracking Code Setup</h3>
              <p className="mb-2">
                Add the following tracking code to the <code>&lt;head&gt;</code>{" "}
                section of your site:
              </p>
              <div className="relative">
                <pre className="bg-base-200 p-4 rounded-lg">
                  <code>{trackingCode}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 btn btn-sm btn-primary"
                >
                  {isCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
