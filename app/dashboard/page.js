export const dynamic = "force-dynamic";
import SurveyNav from "@/components/SurveyNav";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from "next/headers";



// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('rating');

  let totalReviews = 0;
  // Unused variables for future NPS calculation
  // let promotersCount = 0;
  // let detractorsCount = 0;

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  } else if (reviews && reviews.length > 0) {
    totalReviews = reviews.length;
    reviews.forEach(() => {
      // NPS calculation logic can be implemented when needed
      // if (review.rating >= 9) {
      //   promotersCount++;
      // } else if (review.rating >= 7) {
      //   // passives count not used currently
      // } else {
      //   detractorsCount++;
      // }
    });

    if (totalReviews > 0) {
      // npsScore calculation can be implemented when needed
      // npsScore = Math.round(((promotersCount - detractorsCount) / totalReviews) * 100);
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
 