import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

// Shared helper — same fetch-blob download pattern used for invoice on
// the partner side, works for any Cloudinary PDF URL + desired filename.
const downloadPdf = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

const PdfDownloads = ({ jobId }) => {
  const [checkingInvoice, setCheckingInvoice] = useState(false);
  const [checkingPod, setCheckingPod] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [podUrl, setPodUrl] = useState(null);

  const handleCheckInvoice = async () => {
    setCheckingInvoice(true);
    try {
      const response = await api.get(`/api/jobs/${jobId}/invoice`);
      setInvoiceUrl(response.data.invoice.pdfUrl);
      toast.success("Invoice is ready");
    } catch (err) {
      if (err?.response?.status === 404) {
        toast.error("Invoice not generated yet — check back shortly");
      } else {
        toast.error(err?.response?.data?.message || "Failed to check invoice");
      }
    } finally {
      setCheckingInvoice(false);
    }
  };

  const handleCheckPod = async () => {
    setCheckingPod(true);
    try {
      const response = await api.get(`/api/jobs/${jobId}/pod-slip`);
      setPodUrl(response.data.podSlip.pdfUrl);
      toast.success("POD slip is ready");
    } catch (err) {
      if (err?.response?.status === 404) {
        toast.error("POD slip not generated yet — check back shortly");
      } else {
        toast.error(err?.response?.data?.message || "Failed to check POD slip");
      }
    } finally {
      setCheckingPod(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      await downloadPdf(invoiceUrl, "invoice.pdf");
    } catch (err) {
      toast.error("Failed to download invoice",err);
    }
  };

  const handleDownloadPod = async () => {
    try {
      await downloadPdf(podUrl, "pod-slip.pdf");
    } catch (err) {
      toast.error("Failed to download POD slip",err);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="font-semibold text-black mb-2">Documents</h3>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
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
              className="text-sm text-blue-600 underline"
            >
              Download Invoice
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckPod}
            disabled={checkingPod}
            className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
          >
            {checkingPod ? "Checking..." : "Check POD Slip"}
          </button>
          {podUrl && (
            <button
              onClick={handleDownloadPod}
              className="text-sm text-blue-600 underline"
            >
              Download POD Slip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfDownloads;
