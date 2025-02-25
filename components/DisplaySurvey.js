const DisplaySurvey = ({ question1, surveyTheme, reactionType }) => {
  return (
    <div className="flex flex-col items-center justify-center ">
      <h2 className="text-xl font-bold text-center mb-4">Preview</h2>
      <div
        data-theme={surveyTheme}
        className="card bg-base-200 w-full max-w-sm shrink-0 shadow-xl p-8"
      >
        <div className="form-control flex flex-col justify-center items-center">
          <label className="label">
            <span className="label-text">
              {question1} {/* Updated dynamically based on input */}
            </span>
          </label>
{ reactionType === "Stars" &&
          <div className="rating rating-lg">
            {/* Hidden default for 0 stars */}
            <input
              type="radio"
              name="rating-2"
              className="hidden"
              defaultChecked
            />
            <input
              type="radio"
              name="rating-2"
              value="1"
              className="mask mask-star-2 "
            />
            <input
              type="radio"
              name="rating-2"
              value="2"
              className="mask mask-star-2 "
            />
            <input
              type="radio"
              name="rating-2"
              value="3"
              className="mask mask-star-2 "
            />
            <input
              type="radio"
              name="rating-2"
              value="4"
              className="mask mask-star-2 "
            />
            <input
              type="radio"
              name="rating-2"
              value="5"
              className="mask mask-star-2 "
            />
          </div>
}
{ reactionType === "Hearts" &&
          <div class="rating rating-lg	 gap-1">
            <input
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-red-400"
            />
            <input
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-orange-400"
              checked="checked"
            />
            <input
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-yellow-400"
            />
            <input
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-lime-400"
            />
            <input
              type="radio"
              name="rating-3"
              class="mask mask-heart bg-green-400"
            />
          </div>
}
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default DisplaySurvey;
