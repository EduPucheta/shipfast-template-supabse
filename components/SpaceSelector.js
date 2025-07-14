"use client";

import React, { useState } from 'react';
import { useSpace } from '@/app/context/SpaceContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { Plus, Check } from 'lucide-react';

const SpaceSelector = () => {
  const { spaces, selectedSpace, setSelectedSpace, addSpace, loading } = useSpace();
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const supabase = createClientComponentClient();

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) {
      toast.error('Space name cannot be empty.');
      return;
    }

    setIsCreating(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('spaces')
        .insert({
          organization_name: newSpaceName,
          profile_id: user.id,
        })
        .select()
        .single();

      if (error) {
        toast.error('Failed to create space.');
        console.error('Error creating space:', error);
      } else {
        addSpace(data);
        setSelectedSpace(data);
        setNewSpaceName('');
        toast.success('Space created successfully!');
      }
    }
    setIsCreating(false);
  };

  if (loading) {
    return <span className="loading loading-spinner loading-xs"></span>;
  }
  
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        {selectedSpace ? selectedSpace.organization_name : 'Select a Space'}
        <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
        {spaces.map((space) => (
          <li key={space.id}>
            <a onClick={() => setSelectedSpace(space)} className="flex justify-between">
              {space.organization_name}
              {selectedSpace?.id === space.id && <Check size={16} />}
            </a>
          </li>
        ))}

      </ul>
    </div>
  );
};

export default SpaceSelector; 