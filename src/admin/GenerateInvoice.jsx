import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

// Only relevant when a partner deferred — only a POD slip exists so far,
// and price/weight/dimensions should already be saved via JobDetailsForm.
const GenerateInvoice = ({ jobData, jobId }) => {
  const [generating, setGenerating] = useState(false);

  if (jobData.invoiceStatus !== "pending_office_completion") {
    return null;
  }

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // No body needed — backend uses whatever price/weight/dimensions
      // are already saved on the job.
      const response = await api.post(`/api/jobs/${jobId}/invoice`);
      toast.success(response.data.message || "Invoice generation triggered");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate invoice");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="font-semibold text-black mb-2">
        Complete Deferred Invoice
      </h3>
      <p className="text-xs text-gray-500 mb-2">
        Make sure price and weight are saved above before generating.
      </p>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate Invoice"}
      </button>
    </div>
  );
};

export default GenerateInvoice;
