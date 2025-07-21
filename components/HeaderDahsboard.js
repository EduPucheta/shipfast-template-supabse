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
import SpaceSelector from './SpaceSelector';

const links = [
  {
    href: "/dashboard",
    label: "Dashboard"
  },
  {
    href: "/dashboard/configuration",
    label: "Configuration"
  },
];

const supabase = createClientComponentClient({
  supabaseUrl: config.supabase?.url,
  supabaseKey: config.supabase?.anonKey,
});

const HeaderDashboard = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

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
          <div className="p-4 border-b border-base-300">
            <SpaceSelector />
          </div>

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
