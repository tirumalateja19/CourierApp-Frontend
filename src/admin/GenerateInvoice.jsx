import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const GenerateInvoice = ({ jobData, jobId, onSuccess }) => {
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(
    jobData.invoiceStatus === "generated_by_admin" ||
      jobData.invoiceStatus === "generated_at_pickup",
  );

  const handleGenerate = async () => {
    // Read price and packages directly from the jobData prop
    const currentPrice = jobData?.price;
    const currentPackages = jobData?.packages;

    if (!currentPrice || String(currentPrice).trim() === "") {
      toast.error(
        "Please save a valid price on the job before generating the invoice",
      );
      return;
    }

    if (!currentPackages || currentPackages.length === 0) {
      toast.error("Please add package details before generating the invoice");
      return;
    }

    setGenerating(true);
    try {
      const payload = {
        price: String(currentPrice).trim(),
        packages: currentPackages,
      };

      const response = await api.post(`/api/jobs/${jobId}/invoice`, payload);
      toast.success(response.data.message || "Invoice generation triggered");
      setHasGenerated(true);

      if (onSuccess) {
        onSuccess();
      }

      // Cooldown timer to prevent accidental double-clicks
      setTimeout(() => {
        setGenerating(false);
      }, 4000);
      return;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate invoice");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
      <h3 className="font-semibold text-black mb-1">
        {hasGenerated ? "Invoice Management" : "Generate Invoice"}
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        {hasGenerated
          ? "An invoice has already been generated. Make sure any recent updates are saved, then regenerate if needed."
          : "Ensure price and package weights are saved on this job before generating the invoice."}
      </p>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50 font-medium cursor-pointer"
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
