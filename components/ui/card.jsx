export default function Card({ children, className = "" }) {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      {children}
    </div>
  );
} 