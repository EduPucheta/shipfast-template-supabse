"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const DeleteModal = ({ object, objectID, objectTitle, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const table = object === "review" ? "reviews" : "surveys";

  const closeModal = () => modalRef.current.close();

  const handleDelete = async () => {
    setLoading(true);

    if (object === "survey") {
      const { error: reviewsError } = await supabase
        .from("reviews")
        .delete()
        .eq("survey", objectID);

      if (reviewsError) {
        toast.error(
          `Failed to delete survey's reviews: ${reviewsError.message}`
        );
        setLoading(false);
        closeModal();
        return;
      }
    }

    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq("id", objectID)
      .select();

    if (error) {
      console.error(`Error deleting ${object}:`, error);
      toast.error(`Failed to delete ${capitalize(object)}: ${error.message}`);
    } else if (data?.length > 0) {
      toast.success(`${capitalize(object)} deleted successfully`);
      onDeleteSuccess(objectID);
    } else {
      toast.error(
        `Failed to delete ${capitalize(
          object
        )}. You might not have permission.`
      );
    }

    setLoading(false);
    closeModal();
  };

  return (
    <>
      <button
        className="flex items-center gap-2 text-error hover:text-error"
        onClick={() => modalRef.current.showModal()}
      >
        <Trash2 size={18} /> Delete {capitalize(object)}
      </button>

      <dialog
        id={`delete-modal-${objectID}`}
        className="modal flex items-center justify-center z-50"
        ref={modalRef}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete {`"${objectTitle}"`}? This action
            cannot be undone.
          </p>
          <div className="modal-action flex justify-end gap-2 mt-4">
            <button
              className="btn btn-ghost"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button className="btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop "
          aria-hidden="true"
          onClick={closeModal}
        />
      </dialog>
    </>
  );
};

export default DeleteModal;
