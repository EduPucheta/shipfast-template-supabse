"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const DeleteSurveyModal = ({ surveyId, surveyTitle, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("surveys").delete().eq("id", surveyId);
    
    if (error) {
      console.error("Error deleting survey:", error);
      toast.error("Failed to delete survey");
    } else {
      toast.success("Survey deleted");
      onDeleteSuccess(surveyId);
    }
    
    setLoading(false);
    modalRef.current.close();
  };

  const openModal = () => {
    modalRef.current.showModal();
  };

  return (
    <>
      <button className="flex items-center gap-2 text-red-500 hover:text-red-700" onClick={openModal}>
        <Trash2 size={18} /> Delete Survey
      </button>
      
      <dialog 
        id={`delete-modal-${surveyId}`} 
        className="modal fixed inset-0 flex items-center justify-center z-50" 
        ref={modalRef}
      >
        <div className="modal-box bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto relative">
          <h3 className="text-lg font-bold">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete "{surveyTitle}"? This action cannot be undone.
          </p>
          <div className="modal-action flex justify-end gap-2 mt-4">
            <button 
              className="btn px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded" 
              onClick={() => modalRef.current.close()}
            >
              Cancel
            </button>
            <button 
              className="btn btn-error px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded" 
              onClick={handleDelete} 
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop fixed inset-0 bg-black bg-opacity-20" onClick={() => modalRef.current.close()}>
          <button className="hidden">close</button>
        </form>
      </dialog>
    </>
  );
};

export default DeleteSurveyModal;