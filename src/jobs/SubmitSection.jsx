import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const SubmitSection = ({ jobData, jobId, setJobData }) => {
  const [submitting, setSubmitting] = useState(false);
  const [deferring, setDeferring] = useState(false);
  const [checkingInvoice, setCheckingInvoice] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  // Both Submit and Defer only return { message } — no updated job data.
  // Refetch afterward so local state (status, invoiceStatus) reflects
  // what actually happened on the backend.
  const refetchJob = async () => {
    const response = await api.get(`/api/partner/jobs/${jobId}`);
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

  const handleDefer = async () => {
    setDeferring(true);
    try {
      const response = await api.post(
        `/api/jobs/pickup/${jobId}/defer-invoice`,
      );
      toast.success(
        response.data.message || "Invoice deferred, POD slip generating",
      );
      await refetchJob();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to defer invoice");
    } finally {
      setDeferring(false);
    }
  };

  const handleCheckInvoice = async () => {
    setCheckingInvoice(true);
    try {
      const response = await api.get(`/api/jobs/${jobId}/invoice`);
      setInvoiceUrl(response.data.invoice.pdfUrl);
      toast.success("Invoice is ready");
    } catch (err) {
      if (err?.response?.status === 404) {
        toast.error("Not generated yet — check back shortly");
      } else {
        toast.error(err?.response?.data?.message || "Failed to check invoice");
      }
    } finally {
      setCheckingInvoice(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(invoiceUrl);
      // console.log("status:", response.status, "ok:", response.ok);

      const blob = await response.blob();
      // console.log("blob size:", blob.size, "blob type:", blob.type);

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download invoice");
    }
  };

  // Once a job has moved past "created"/pre-pickup, Submit/Defer no longer
  // apply — this section shouldn't show at all if either action already happened.
  const alreadyFinalized =
    jobData.invoiceStatus === "generated_at_pickup" ||
    jobData.invoiceStatus === "pending_office_completion";

  if (alreadyFinalized) {
    return (
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-black mb-2">Submission</h3>
        <p className="text-sm text-gray-600 mb-2">
          This job has already been{" "}
          {jobData.status === "picked_up" ? "submitted" : "deferred"}.
        </p>

        {/* Only Submit (not Defer) generates an invoice the partner can check */}
        {jobData.invoiceStatus === "generated_at_pickup" && (
          <div>
            <button
              onClick={handleCheckInvoice}
              disabled={checkingInvoice}
              className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
            >
              {checkingInvoice ? "Checking..." : "Check Invoice"}
            </button>

            {invoiceUrl && (
              <button
                onClick={handleDownloadInvoice}
                className="ml-3 text-sm text-blue-600 underline"
              >
                Download Invoice
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="font-semibold text-black mb-2">Submission</h3>
      <p className="text-xs text-gray-500 mb-2">
        Requires weight and price to be saved first.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting || deferring}
          className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit (Invoice + POD)"}
        </button>
        <button
          onClick={handleDefer}
          disabled={submitting || deferring}
          className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition disabled:opacity-50"
        >
          {deferring ? "Deferring..." : "Defer Invoice (POD only)"}
        </button>
      </div>
    </div>
  );
};

export default SubmitSection;
