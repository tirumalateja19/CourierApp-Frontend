import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

// Only relevant when admin has self-assigned a job — admin is acting as
// the partner here, but unlike the partner flow, there's no Defer option.
const AdminSubmit = ({ jobData, jobId, setJobData }) => {
  const [submitting, setSubmitting] = useState(false);

  // Only show if admin actually self-assigned, and nothing's been
  // generated yet for this job.
  if (jobData.assignedToRole !== "admin" || jobData.invoiceStatus) {
    return null;
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await api.post(`/api/jobs/pickup/${jobId}/submit`);
      toast.success(response.data.message || "Job submitted");

      // Same as partner's SubmitSection — submit only returns { message },
      // so refetch to get the real invoiceStatus once it's set.
      const refreshed = await api.get(`/api/jobs/${jobId}`);
      setJobData(refreshed.data.jobData);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="font-semibold text-black mb-2">Submit</h3>
      <p className="text-xs text-gray-500 mb-2">
        Requires weight and price to be saved first.
      </p>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit (Invoice + POD)"}
      </button>
    </div>
  );
};

export default AdminSubmit;
