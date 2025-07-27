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
          {survey.target_devices ? (
            Object.entries(survey.target_devices)
              .filter(([, value]) => value)
              .map(([key]) => key)
              .join(", ")
          ) : (
            <span className="text-gray-500">No target devices specified.</span>
          )}
        </p>
        <p className="mb-2">
          <strong>Website Targeting:</strong>{" "}
          {survey.targeting_type === 'all_pages' ? (
            <span className="text-green-600">All websites (no restrictions)</span>
          ) : survey.target_urls && survey.target_urls.length > 0 ? (
            <span className="text-blue-600">{survey.target_urls.join(", ")}</span>
          ) : (
            <span className="text-gray-500">No specific domains configured.</span>
          )}
        </p>
      </div>
    </div>
  );
} 