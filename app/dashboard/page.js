import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ButtonAccount from "@/components/ButtonAccount";
export const dynamic = "force-dynamic";


import Header from "@/components/Header";
import TableReviews from "@/components/TableReviews";


// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  return (
    <>
      {" "}
      <Header />

      <div>Helo!</div>
      <TableReviews />
    </>
  );
}
