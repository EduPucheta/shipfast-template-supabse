"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
            // Only access localStorage after component is mounted
            let lastSelectedSpaceId = null;
            if (isMounted && typeof window !== 'undefined') {
              lastSelectedSpaceId = localStorage.getItem('selectedSpaceId');
            }
            const lastSelected = userSpaces.find(s => s.id === lastSelectedSpaceId);
            setSelectedSpace(lastSelected || userSpaces[0]);
          }
        }
      }
      setLoading(false);
    };

    if (isMounted) {
      fetchSpaces();
    }
  }, [supabase, isMounted]);

  const addSpace = async (name, domain) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    const { data: newSpace, error } = await supabase
      .from('spaces')
      .insert([
        { organization_name: name, organization_url: domain, profile_id: user.id }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating space:', error);
      throw error;
    }

    setSpaces(prevSpaces => [...prevSpaces, newSpace]);
    setSelectedSpace(newSpace);
    return newSpace;
  };

  const switchSpace = (space) => {
    setSelectedSpace(space);
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedSpaceId', space.id);
    }
  };
  
  const value = {
    spaces,
    selectedSpace,
    setSelectedSpace: switchSpace,
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