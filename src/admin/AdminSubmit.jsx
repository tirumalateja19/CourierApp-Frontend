import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AdminSubmit = ({ jobData, jobId, setJobData }) => {
  const [submitting, setSubmitting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (jobData.assignedToRole !== "admin") {
    return null;
  }

  const refetchJob = async () => {
    const response = await api.get(`/api/jobs/${jobId}`);
    setJobData(response.data.jobData);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await api.post(`/api/jobs/pickup/${jobId}/submit`);
      toast.success(response.data.message || "Job submitted");
      await refetchJob();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const response = await api.post(`/api/jobs/pickup/${jobId}/submit`);
      toast.success(response.data.message || "Regeneration triggered");
      await refetchJob();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to regenerate");
    } finally {
      setRegenerating(false);
    }
  };

  if (jobData.invoiceStatus) {
    return (
      <div>
        <h3 className="font-semibold text-black mb-2">Submit</h3>
        <p className="text-sm text-gray-600 mb-3">
          This job has already been submitted.
        </p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition disabled:opacity-50"
        >
          {regenerating ? "Regenerating..." : "Regenerate both"}
        </button>
      </div>
    );
  }

  return (
    <div>
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
