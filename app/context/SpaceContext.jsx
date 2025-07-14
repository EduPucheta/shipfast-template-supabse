"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSpaces = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userSpaces, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('profile_id', user.id);

        if (error) {
          console.error('Error fetching spaces:', error);
        } else {
          setSpaces(userSpaces);
          if (userSpaces.length > 0) {
            setSelectedSpace(userSpaces[0]);
          }
        }
      }
      setLoading(false);
    };

    fetchSpaces();
  }, [supabase]);

  const addSpace = (space) => {
    setSpaces(prevSpaces => [...prevSpaces, space]);
  };
  
  const value = {
    spaces,
    selectedSpace,
    setSelectedSpace,
    loading,
    addSpace
  };

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>;
};

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (context === undefined) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
}; 