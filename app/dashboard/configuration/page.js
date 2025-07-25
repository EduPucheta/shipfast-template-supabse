'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteModal from '@/components/DeleteModal';
import { Crisp } from 'crisp-sdk-web';
import config from '@/config';

export default function ConfigurationPage() {
  const [isCopied, setIsCopied] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSpace, setEditingSpace] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);

  const supabase = createClientComponentClient();

  const handleSupportClick = () => {
    if (config.crisp?.id) {
      Crisp.chat.show();
      Crisp.chat.open();
    } else if (config.mailgun?.supportEmail) {
      window.open(
        `mailto:${config.mailgun.supportEmail}?subject=Need help with ${config.appName}`,
        '_blank'
      );
    }
  };

  const trackingCode = `<script src="https://feedbackito.com/widget.js"></script>`;

  useEffect(() => {
    const fetchUserAndSpaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();

          if (profile) {
            setPlan(profile.plan);
          }

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
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndSpaces();
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

  const handleDeleteSuccess = (deletedSpaceId) => {
    setSpaces((currentSpaces) =>
      currentSpaces.filter((space) => space.id !== deletedSpaceId)
    );
  };

  const handleUpdateSpace = async (e) => {
    e.preventDefault();
    if (!editingSpace) return;
    setIsUpdating(true);

    const updatedData = {
      organization_name: e.currentTarget.organization_name.value,
      organization_url: e.currentTarget.organization_url.value,
    };

    const { data, error: updateError } = await supabase
      .from('spaces')
      .update(updatedData)
      .eq('id', editingSpace.id)
      .select();

    if (updateError) {
      console.error('Error updating space:', updateError);
      toast.error(updateError.message || 'Failed to update space.');
    } else if (data && data.length > 0) {
      setSpaces((currentSpaces) =>
        currentSpaces.map((space) =>
          space.id === editingSpace.id ? data[0] : space
        )
      );
      toast.success('Space updated successfully!');
      setEditingSpace(null);
    } else {
      toast.error(
        'Failed to update space. You might not have the required permissions.'
      );
    }
    setIsUpdating(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuration</h1>
        <button onClick={handleSupportClick} className="btn btn-sm">
          💬 Support
        </button>
      </div>
      <div className="grid gap-6">
        {/* Profile Section */}
        {user && (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Profile</h3>
            <div className="p-4 border rounded-lg bg-base-200">
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.name || 'Avatar'}
                    className="w-12 h-12 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="w-12 h-12 bg-base-300 flex justify-center items-center rounded-full text-xl font-bold">
                    {user.user_metadata?.name?.charAt(0) ||
                      user.email?.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-semibold">
                    {user.user_metadata?.name || 'No name provided'}
                  </p>
                  <p className="text-sm text-base-content/80">{user.email}</p>
                </div>
              </div>
              {plan && (
                <>
                  <div className="divider"></div>
                  <div className="flex justify-between items-center">
                    <p>
                      <strong>Plan:</strong>{' '}
                      <span className="font-semibold capitalize">{plan}</span>
                    </p>
                    <button className="btn btn-sm btn-primary">
                      Change plan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Tracking Code Setup</h3>
              <p className="mb-2">
                Add the following tracking code to the <code>&lt;head&gt;</code>{' '}
                section of your site:
              </p>
              <p className="mb-2 ">
                This tracking script supports a single domain only.
              </p>
              <div className="relative">
                <pre className="bg-neutral p-4 rounded-lg">
                  <code className="text-base-200">{trackingCode}</code>
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
          <h3 className="text-lg font-medium mb-4">Your Websites</h3>
          {isLoading && <p>Loading spaces...</p>}
          {error && <p className="text-error">Error: {error}</p>}
          {!isLoading && !error && spaces.length === 0 && (
            <p>No spaces found for your profile.</p>
          )}
          {!isLoading &&
            !error &&
            spaces.length > 0 && (
              <ul className="space-y-3">
                {spaces.map((space) => (
                  <li
                    key={space.id}
                    className="p-4 border rounded-lg bg-base-200 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-md">
                        {space.organization_name}
                      </h4>
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
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSpace(space)}
                        className="btn btn-ghost btn-sm flex items-center gap-2"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <DeleteModal
                        object="space"
                        objectID={space.id}
                        objectTitle={space.organization_name}
                        onDeleteSuccess={() => handleDeleteSuccess(space.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>

      {editingSpace && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <button
              onClick={() => setEditingSpace(null)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Edit Space</h3>
            <form onSubmit={handleUpdateSpace}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Organization Name</span>
                </label>
                <input
                  type="text"
                  name="organization_name"
                  defaultValue={editingSpace.organization_name}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Organization URL</span>
                </label>
                <input
                  type="url"
                  name="organization_url"
                  defaultValue={editingSpace.organization_url}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="modal-action mt-6">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setEditingSpace(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setEditingSpace(null)}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
