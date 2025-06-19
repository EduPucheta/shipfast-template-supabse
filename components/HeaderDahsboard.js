"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import logo from "@/app/icon.png";
import config from "@/config";
import ButtonAccount from "./ButtonAccount";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard"
  },
  {
    href: "/dashboard/space-analytics",
    label: "Space Analytics"
  },
  {
    href: "/dashboard/configuration",
    label: "Configuration"
  },
  {
    href: "/dashboard/users",
    label: "Users"
  }
];

// Initialize Supabase client using the config object
// Ensure config.supabase.url and config.supabase.anonKey are defined in your @/config.js
const supabase = createClientComponentClient({
  supabaseUrl: config.supabase?.url,
  supabaseKey: config.supabase?.anonKey,
});

// A header with a logo on the left, links in the center (like Pricing, etc...), and a CTA (like Get Started or Login) on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const HeaderDashboard = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [userSpaces, setUserSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUserAndSpaces = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: spaces, error } = await supabase
          .from('spaces')
          .select('id, organization_name')
          .eq('profile_id', session.user.id);

        if (error) {
          console.error('Error fetching spaces:', error);
          setUserSpaces([]);
        } else {
          setUserSpaces(spaces || []);
          if (spaces && spaces.length > 0) {
            setSelectedSpace(spaces[0].id);
          }
        }
      } else {
        setCurrentUser(null);
        setUserSpaces([]);
      }
    };

    getUserAndSpaces();
  }, []);

  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  const handleSpaceChange = (event) => {
    setSelectedSpace(event.target.value);
    console.log("Selected Space ID:", event.target.value);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          type="button"
          className="btn btn-square btn-ghost"
          onClick={() => setIsOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <Link
              className="flex items-center gap-2"
              href="/dashboard"
              title={`${config.appName} dashboard`}
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8"
                priority={true}
                width={32}
                height={32}
              />
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
            <button
              type="button"
              className="lg:hidden btn btn-square btn-ghost"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Create New Survey Button */}
          <div className="p-4 border-b border-base-300">
            <Link
              href="/dashboard/new-survey"
              className="btn btn-outline w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create new survey
            </Link>
          </div>

          {/* Spaces Dropdown */}
          {currentUser && userSpaces.length > 0 && (
            <div className="p-4 border-b border-base-300">
              <select
                id="spaces-dropdown"
                name="spaces-dropdown"
                className="select select-bordered w-full"
                value={selectedSpace}
                onChange={handleSpaceChange}
              >
                {userSpaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.organization_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors"
                title={link.label}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Account Button */}
          <div className="p-4 border-t border-base-300">
            <ButtonAccount />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default HeaderDashboard;
