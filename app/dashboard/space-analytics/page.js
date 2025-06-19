import CardNpsScore from "@/components/CardNpsScore";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function calculateNPS() {
  const supabase = createServerComponentClient({ cookies });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating");

  if (!reviews || reviews.length === 0) {
    return {
      npsScore: 0,
      totalReviews: 0,
      promotersCount: 0,
      passivesCount: 0,
      detractorsCount: 0,
    };
  }

  const promoters = reviews.filter((r) => r.rating >= 9).length;
  const passives = reviews.filter((r) => r.rating >= 7 && r.rating <= 8).length;
  const detractors = reviews.filter((r) => r.rating <= 6).length;
  const total = reviews.length; 

  const npsScore = Math.round(
    ((promoters - detractors) / total) * 100
  );

  return {
    npsScore,
    totalReviews: total,
    promotersCount: promoters,
    passivesCount: passives,
    detractorsCount: detractors,
  };
}

export default async function SpaceAnalytics() {
  const npsData = await calculateNPS();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Space Analytics</h1>
        <p className="text-base-content/60">
          Track your account performance and customer satisfaction metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <CardNpsScore {...npsData} />
        </div>
        {/* Add more analytics cards here in the future */}
      </div>
    </div>
  );
} 