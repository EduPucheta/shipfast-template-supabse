import dayjs from "dayjs";

export default function SurveyDetailsDisplay({ survey }) {
  if (!survey) {
    return null;
  }

  return (
    <div className="card bg-base-100 min-w-[400px]">
      <div className=" flex flex-col gap-2 flex-start items-start">
        <h2 className="card-title text-2xl mb-4">Survey Details</h2>
        <p className="mb-2">
          <strong>Title:</strong> {survey.survey_title}
        </p>
        <p className="mb-2">
          <strong>Description:</strong>{" "}
          {survey.survey_description ? (
            survey.survey_description
          ) : (
            <span className="text-gray-500">No description provided.</span>
          )}
        </p>
        <p className="mb-2">
          <strong>Created:</strong>{" "}
          {dayjs(survey.created_at).format("MMMM D, YYYY [at] h:mm A")}
        </p>
        <p className="mb-2">
          <strong>Status:</strong>{" "}
          {survey.is_active ? (
            <span className="badge badge-success">Active</span>
          ) : (
            <span className="badge badge-error">Inactive</span>
          )}
        </p>
        <p className="mb-2">
          <strong>Target Devices:</strong>{" "}
          {survey.survey_devices && survey.survey_devices.length > 0 ? (
            survey.survey_devices.map(d => d.device_name).join(', ')
          ) : (
            <span className="text-gray-500">No target devices specified.</span>
          )}
        </p>
        <div className="mb-2 w-full">
          <strong>Target Pages:</strong>{" "}
          {Array.isArray(survey.target_urls) && survey.target_urls.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {survey.target_urls.map((item, idx) => {
                const entry =
                  item && typeof item === "object"
                    ? { path: item.path || "", matchType: item.matchType || "exact" }
                    : { path: String(item || ""), matchType: "exact" };

                const isAbsolute = /^https?:\/\//i.test(entry.path);
                const isDomainLike = /\w+\.[a-z]{2,}/i.test(entry.path) && !entry.path.startsWith("/");
                const href = isAbsolute ? entry.path : isDomainLike ? `https://${entry.path}` : entry.path || "#";

                return (
                  <a
                    key={`${entry.path}-${idx}`}
                    href={href || "#"}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="badge badge-outline badge-primary hover:badge-secondary cursor-pointer max-w-full"
                    title={`${entry.path} (${entry.matchType})`}
                  >
                    <span className="truncate max-w-[220px]">{entry.path || "(empty)"}</span>
                    <span className="ml-2 badge badge-ghost badge-sm normal-case">{entry.matchType}</span>
                  </a>
                );
              })}
            </div>
          ) : (
            <span className="text-gray-500">No target pages specified.</span>
          )}
        </div>
      </div>
    </div>
  );
} 