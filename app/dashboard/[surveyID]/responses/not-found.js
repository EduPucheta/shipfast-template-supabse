import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-bold">Survey Not Found</h2>
      <p className="text-gray-600">The survey you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
      <Link 
        href="/dashboard" 
        className="btn btn-primary"
      >
        Return to Dashboard
      </Link>
    </div>
  );
} 