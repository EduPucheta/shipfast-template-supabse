import { Inter } from "next/font/google";
import config from "@/config";
import "../globals.css";

const font = Inter({ subsets: ["latin"] });

export default function WidgetLayout({ children }) {
  return (
    <html lang="en" className={font.className}>
      <body data-theme="emerald" className="bg-transparent" suppressHydrationWarning={true}>
        <div className="widget-container" suppressHydrationWarning={true}>
          {children}
        </div>
      </body>
    </html>
  );
}
    