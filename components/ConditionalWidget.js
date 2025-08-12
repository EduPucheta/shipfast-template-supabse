'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import config from '@/config';

export default function ConditionalWidget() {
  const pathname = usePathname();
  const [shouldLoadWidget, setShouldLoadWidget] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Don't load widget on the widget page itself to prevent infinite recursion
    const isWidgetPage = pathname === '/widjet' || pathname.startsWith('/widjet/');
    setShouldLoadWidget(!isWidgetPage);
  }, [pathname]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || !shouldLoadWidget) {
    return null;
  }

  // Use proper URL based on environment
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : `https://${config.domainName}`;

  return (
    <Script 
      src={`${baseUrl}/widget.js?space_id=f2384ae7-ce8b-4a31-adf4-1e4bca8f0604`}
      strategy="afterInteractive"
    />
  );
} 