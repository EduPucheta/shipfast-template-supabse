"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSpace } from '@/app/context/SpaceContext';
import { Check } from 'lucide-react';

const SpaceSelector = () => {
  const { spaces, selectedSpace, setSelectedSpace, loading } = useSpace();
  const router = useRouter();

  const handleSelectSpace = (space) => {
    setSelectedSpace(space);
    router.push('/dashboard');
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
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100 rounded-box w-52">
        {spaces.map((space) => (
          <li key={space.id}>
            <a onClick={() => handleSelectSpace(space)} className={`flex justify-between ${selectedSpace?.id === space.id ? 'active' : ''}`}>
              <span>{space.organization_name}</span>
              {selectedSpace?.id === space.id && <Check size={16} />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpaceSelector; 