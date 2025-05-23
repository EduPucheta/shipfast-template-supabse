import React from 'react';

const RecommendedActions = () => {
  const mockActions = [
    {
      id: 1,
      title: "Improve Customer Support Response Time",
      description: "Based on feedback, customers are experiencing longer than expected wait times for support responses.",
      impact: "High",
      effort: "Medium",
      status: "Pending"
    },
    {
      id: 2,
      title: "Enhance Product Documentation",
      description: "Users reported difficulty finding specific information in the current documentation.",
      impact: "Medium",
      effort: "Low",
      status: "In Progress"
    },
    {
      id: 3,
      title: "Implement Feature Request: Dark Mode",
      description: "Multiple users have requested a dark mode option for better visibility in low-light conditions.",
      impact: "Medium",
      effort: "High",
      status: "Planned"
    }
  ];

  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Based on survey responses, here are the key areas where improvements can be made to enhance user satisfaction and product experience.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockActions.map((action) => (
          <div key={action.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="badge badge-primary">Impact: {action.impact}</div>
                <div className="badge badge-secondary">Effort: {action.effort}</div>
                <div className="badge badge-accent">{action.status}</div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedActions; 