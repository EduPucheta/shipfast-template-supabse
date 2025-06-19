'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ConfigurationPage() {
  const [isCopied, setIsCopied] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const supabase = createClientComponentClient();

  const trackingCode = `<script src="https://shipfast-template-supabse-k6pc.vercel.app/widget.js"></script>`;

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error: spacesError } = await supabase
            .from('spaces')
            .select('*')
            .eq('profile_id', user.id);

          if (spacesError) {
            throw spacesError;
          }
          setSpaces(data || []);
        } else {
          setSpaces([]); // No user logged in
        }
      } catch (err) {
        console.error('Error fetching spaces:', err);
        setError(err.message || 'Failed to fetch spaces.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, [supabase]);

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
              <p className="mb-2 ">
                This tracking script supports a single domain only.
              </p>
              <div className="relative">
                <pre className="bg-neutral p-4 rounded-lg">
                  <code className='text-base-200'>{trackingCode}</code>
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

        {/* Display Spaces */}
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Your Spaces</h3>
          {isLoading && <p>Loading spaces...</p>}
          {error && <p className="text-error">Error: {error}</p>}
          {!isLoading && !error && spaces.length === 0 && (
            <p>No spaces found for your profile.</p>
          )}
          {!isLoading && !error && spaces.length > 0 && (
            <ul className="space-y-3">
              {spaces.map((space) => (
                <li key={space.id} className="p-4 border rounded-lg bg-base-200">
                  <h4 className="font-semibold text-md">{space.organization_name}</h4>
                  {space.organization_url && (
                    <a
                      href={space.organization_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm   hover:underline"
                    >
                      {space.organization_url}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
