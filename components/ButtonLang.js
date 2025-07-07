'use client';

import { useTranslation } from '@/app/i18n/client';
import { languages } from '@/app/i18n/settings';
import { useRouter } from 'next/navigation';

export default function ButtonLang({ lng }) {
  const { t, i18n } = useTranslation(lng);
  const router = useRouter();

  const changeLanguage = (newLng) => {
    i18n.changeLanguage(newLng);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            i18n.language === lang
              ? 'bg-primary text-primary-content'
              : 'bg-base-200 text-base-content'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
} 