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
      src="http://localhost:3000/widget.js?space_id=f2384ae7-ce8b-4a31-adf4-1e4bca8f0604"
      strategy="afterInteractive"
    />
  );
} 