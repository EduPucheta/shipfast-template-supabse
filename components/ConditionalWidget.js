'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConditionalWidget() {
  const pathname = usePathname();
  const [shouldLoadWidget, setShouldLoadWidget] = useState(false);

  useEffect(() => {
    // Don't load widget on the widget page itself to prevent infinite recursion
    const isWidgetPage = pathname === '/widjet' || pathname.startsWith('/widjet/');
    setShouldLoadWidget(!isWidgetPage);
  }, [pathname]);

  if (!shouldLoadWidget) {
    return null;
  }

  return (
    <Script 
      src="https://feedbackito.com/widget.js?space_id=d5ae1b99-13d4-48a3-a0ad-cf934528055b"
      strategy="afterInteractive"
    />
  );
} 