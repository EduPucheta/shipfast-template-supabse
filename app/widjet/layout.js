
import "../globals.css";

export default function WidgetLayout({ children }) {
  return (
    <div className="widget-container bg-transparent" suppressHydrationWarning={true}>
      {children}
    </div>
  );
}
    