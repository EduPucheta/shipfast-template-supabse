export const dynamic = "force-dynamic";
import TableReviews from "@/components/TableReviews";
import SurveyNav from "@/components/SurveyNav";
import MetricSummary from "@/components/MetricSummary";
import CreateSurvey from "@/components/CreateSurvey";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import config from "@/config";


// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const supabase = createClientComponentClient({
    supabaseUrl: config.supabase?.url,
    supabaseKey: config.supabase?.anonKey,
  });

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('rating');

  let npsScore = 0;
  let totalReviews = 0;
  let promotersCount = 0;
  let passivesCount = 0;
  let detractorsCount = 0;

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  } else if (reviews && reviews.length > 0) {
    totalReviews = reviews.length;
    reviews.forEach(review => {
      if (review.rating >= 9) {
        promotersCount++;
      } else if (review.rating >= 7) {
        passivesCount++;
      } else {
        detractorsCount++;
      }
    });

    if (totalReviews > 0) {
      npsScore = Math.round(((promotersCount - detractorsCount) / totalReviews) * 100);
    }
  } else {
    // No reviews yet, all counts remain 0
  }

  return (
    <>
      <div className="container w-full min-h-screen flex flex-col justify-start items-center mx-auto gap-6 p-6">
        <div className="w-full mb-6">

        </div>

        <div className="w-full flex justify-end mb-4">
          <Link href={"/dashboard/new-survey"} className="btn">
            <Plus />
            Create new survey
          </Link>
        </div>
        <div className="w-full">
          <SurveyNav />
        </div>
      </div>
    </>
  );
}
 