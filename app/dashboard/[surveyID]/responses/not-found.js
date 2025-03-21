import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Survey Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          The survey you&apos;re looking for doesn&apos;t exist or has been deleted. 
          This could happen if the survey was removed or if you&apos;re using an outdated link.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link 
          href="/dashboard" 
          className="btn btn-primary btn-lg"
        >
          Return to Dashboard
        </Link>
        <Link 
          href="/dashboard/surveys" 
          className="btn btn-outline btn-lg"
        >
          View All Surveys
        </Link>
      </div>
    </div>
  );
} 