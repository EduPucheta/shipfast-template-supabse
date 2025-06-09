function CardNpsScore({ npsScore, totalReviews, promotersCount, passivesCount, detractorsCount }) {
  let npsColorClass = "bg-neutral text-neutral-content";
  let npsTextColorClass = "text-neutral-content";
  let npsText = "Neutral";
  let npsEmoji = "😐"; // Neutral emoji

  if (npsScore > 0) {
    npsColorClass = "bg-success text-success-content";
    npsTextColorClass = "text-success-content";
    npsText = "Good";
    npsEmoji = "😊"; // Positive emoji
  } else if (npsScore < 0) {
    npsColorClass = "bg-error text-error-content";
    npsTextColorClass = "text-error-content";
    npsText = "Needs Improvement";
    npsEmoji = "😟"; // Negative emoji
  }

  if (totalReviews === 0) {
    npsText = "No Reviews Yet";
    npsColorClass = "bg-base-200 text-base-content";
    npsTextColorClass = "text-base-content";
    npsEmoji = "🤷"; // Shrugging emoji for no data
  }

  return (
    <div className={`card shadow-sm ${npsColorClass} transition-all duration-300 ease-in-out max-w-xs mx-auto`}>
      <div className="card-body p-3">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className={`card-title text-base font-bold ${npsTextColorClass} opacity-90`}>
            Global NPS
          </h2>
          <div className={`text-xl ${npsTextColorClass} opacity-80`}>{npsEmoji}</div>
        </div>

        {totalReviews > 0 ? (
          <>
            <p className={`text-4xl font-bold ${npsTextColorClass} text-center my-2`}>
              {npsScore}
            </p>
            <p className={`text-center text-sm font-medium ${npsTextColorClass} opacity-90`}>
              {npsText}
            </p>
            <p className={`text-2xs ${npsTextColorClass} text-center opacity-70 mt-0.5 mb-2`}>
              {totalReviews} review{totalReviews === 1 ? "" : "s"}
            </p>

            {/* Data Summary Section - more compact */}
            <div className={`grid grid-cols-3 gap-0.5 text-center mb-2 p-1.5 rounded bg-opacity-10 ${npsScore > 0 ? 'bg-success-content/10' : npsScore < 0 ? 'bg-error-content/10' : 'bg-neutral-content/5'}`}>
              <div>
                <p className={`text-lg font-semibold ${npsTextColorClass}`}>{promotersCount}</p>
                <p className={`text-3xs ${npsTextColorClass} opacity-80`}>Promoters</p>
              </div>
              <div>
                <p className={`text-lg font-semibold ${npsTextColorClass}`}>{passivesCount}</p>
                <p className={`text-3xs ${npsTextColorClass} opacity-80`}>Passives</p>
              </div>
              <div>
                <p className={`text-lg font-semibold ${npsTextColorClass}`}>{detractorsCount}</p>
                <p className={`text-3xs ${npsTextColorClass} opacity-80`}>Detractors</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className={`text-2xl font-bold ${npsTextColorClass} text-center my-2.5`}>{npsText === "No Reviews Yet" ? npsEmoji : "N/A"}</p>
            <p className={`text-center text-xs ${npsTextColorClass} opacity-80`}>{npsText}</p>
          </>
        )}

        <div className="mt-2 text-center">
          <details className="collapse collapse-arrow border-none bg-transparent text-2xs shadow-none max-w-full mx-auto">
            <summary className={`collapse-title text-2xs font-normal ${npsTextColorClass === 'text-base-content' ? 'text-neutral-focus' : npsTextColorClass} opacity-70 hover:opacity-90 cursor-pointer py-1 min-h-0 flex items-center justify-center`}>
              <span className="mr-1">ⓘ</span> How is NPS calculated?
            </summary>
            <div className="collapse-content text-base-content text-left p-1.5 bg-base-100 rounded-md mt-1 shadow-md">
              <p className="text-3xs">
                NPS: % Promoters (9-10) - % Detractors (0-6).
                Likelihood to recommend (0-10 scale).
                Based on &quot;How likely are you to recommend us?&quot;
              </p>
              <p className="mt-0.5 text-3xs font-semibold">
                 Score: -100 to +100.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default CardNpsScore; 