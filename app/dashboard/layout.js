import { redirect } from "next/navigation";
import config from "@/config";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import HeaderDashboard from "@/components/HeaderDahsboard";
import { SpaceProvider } from "@/app/context/SpaceContext";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({ children }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return (
    <SpaceProvider>
      <HeaderDashboard />
      <div className="lg:pl-64 min-h-screen bg-base-100">
        <main className="   ">
          {children}
        </main>
      </div>
    </SpaceProvider>
  );
}
