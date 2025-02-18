import React from "react";

const CreateSurvey = () => {
  return (
    <div className="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl m-8">
      <div className="card-body">
        <h2 className="text-xl font-bold text-center">Create a New Survey</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Survey Name</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter survey name" 
            className="input input-bordered" 
            required 
          />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Create Survey</button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
