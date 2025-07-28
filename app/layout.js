import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
import Script from "next/script";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import { PostHogProvider } from "@/components/PostHogProvider";
import ConditionalWidget from "@/components/ConditionalWidget";
import config from "@/config";
import "./globals.css";
import { SurveyProvider } from "./context/SurveyContext";
import { languages } from './i18n/settings';
import { cookies } from 'next/headers';

const font = Inter({ subsets: ["latin"] });

const LTR_LANGUAGES = ['en', 'es'];

export const viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const lng = cookieStore.get('i18next')?.value || 'en';
  const dir = LTR_LANGUAGES.includes(lng) ? 'ltr' : 'rtl';

  return (
    <SurveyProvider>
      <html
        lang={lng}
        dir={dir}
        className={font.className}
      >
        {config.domainName && (
          <head>
            <PlausibleProvider domain={config.domainName} />
            <Script id="microsoft-clarity" strategy="beforeInteractive">
              {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window, document, "clarity", "script", "rwxrulgbze");`}
            </Script>
          </head>
        )}
        <body data-theme="emerald">
          <PostHogProvider>
            {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
            <ClientLayout lng={lng}>{children}</ClientLayout>
            <ConditionalWidget />
          </PostHogProvider>
        </body>
      </html>
    </SurveyProvider>
  );
}