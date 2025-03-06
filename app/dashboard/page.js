export const dynamic = "force-dynamic";
import TableReviews from "@/components/TableReviews";
import SurveyNav from "@/components/SurveyNav";
import MetricSummary from "@/components/MetricSummary";
import CreateSurvey from "@/components/CreateSurvey";
import Link from "next/link";
import { Plus } from "lucide-react";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <>
      {" "}
      <div className="container bg-base-100 w-full min-h-screen  flex flex-col justify-start items-center  mx-auto gap-6 p-6">
      <div className=" flex flex-col justify-center items-end ">
        
        <Link href={"/dashboard/new-survey"} className="btn m-4">
          <Plus />
          Create new survey
        </Link>
        <SurveyNav />
      </div>
      </div>
    </>
  );
}
