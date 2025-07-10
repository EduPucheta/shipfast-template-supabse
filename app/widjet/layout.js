import { Inter } from "next/font/google";
import config from "@/config";
import "../globals.css";

const font = Inter({ subsets: ["latin"] });

export default function WidgetLayout({ children }) {
  return (
    <div className="widget-container bg-transparent" suppressHydrationWarning={true}>
      {children}
    </div>
  );
}
    