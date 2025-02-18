import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import TableReviews from "@/components/TableReviews";
import SurveyNav from "@/components/SurveyNav";
import MetricSummary from "@/components/MetricSummary";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <>
      {" "}
      <Header />
      <div className="container bg-base-100 max-w-[50%] flex justify-center items-start flex-row mx-auto gap-6 p-6">
        <SurveyNav />
        <div>
          <MetricSummary />
          <TableReviews />
        </div>
      </div>
    </>
  );
}
