import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const GenerateInvoice = ({ jobData, jobId }) => {
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  if (jobData.invoiceStatus !== "pending_office_completion") {
    return null;
  }

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await api.post(`/api/jobs/${jobId}/invoice`, {});
      toast.success(response.data.message || "Invoice generation triggered");
      setHasGenerated(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate invoice");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-black mb-2">Deferred invoice</h3>
      {!hasGenerated && (
        <p className="text-xs text-gray-500 mb-2">
          Make sure price and weight are saved above before generating.
        </p>
      )}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
      >
        {generating
          ? "Working..."
          : hasGenerated
            ? "Regenerate invoice"
            : "Generate invoice"}
      </button>
    </div>
  );
};

export default GenerateInvoice;
