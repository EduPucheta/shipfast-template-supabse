'use client';

import { useTranslation } from '@/app/i18n/client';
import { languages } from '@/app/i18n/settings';

import { ChevronDown } from 'lucide-react';

export default function ButtonLang({ lng }) {
  const { i18n } = useTranslation(lng);


  const changeLanguage = async (newLng) => {
    // Set the cookie immediately
    document.cookie = `i18next=${newLng}; path=/; max-age=31536000`; // 1 year
    
    // Change the language in i18next
    i18n.changeLanguage(newLng);
    
    // Force a complete page reload to ensure server components get the new language
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        {i18n.language.toUpperCase()}
        <ChevronDown size={16} />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-24"
      >
        {languages
          .filter((l) => i18n.language !== l)
          .map((lang) => (
            <li key={lang}>
              <button
                className="btn btn-sm btn-ghost w-full"
                onClick={() => changeLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
} 