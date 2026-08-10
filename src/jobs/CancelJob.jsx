import { useState } from "react";
import toast from "react-hot-toast";
import { Ban } from "lucide-react";
import api from "../api/axios";

const CancelJob = ({ jobData, jobId, setJobData }) => {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");

  const alreadyCancelled = jobData.cancelled;
  const alreadyDispatched = jobData.status === "Dispatched";

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const response = await api.patch(`/api/admin/${jobId}/cancel`, {
        cancelledReason: reason || undefined,
      });
      toast.success(response.data.message || "Job cancelled");
      setJobData(response.data.jobData);
      setConfirming(false);
      setReason("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel job");
    } finally {
      setCancelling(false);
    }
  };

  if (alreadyCancelled) {
    return (
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-black mb-2">Cancel job</h3>
        <p className="text-sm text-gray-600">
          This job has been cancelled
          {jobData.cancelReason ? `: "${jobData.cancelReason}"` : "."}
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="font-semibold text-black mb-2">Cancel job</h3>

      {alreadyDispatched && (
        <p className="text-xs text-gray-500 mb-2">
          This job has already been dispatched.
        </p>
      )}

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={alreadyDispatched}
          className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Ban className="size-4" />
          Cancel job
        </button>
      ) : (
        <div className="flex flex-col gap-2 max-w-md">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            rows={2}
            className="p-2 rounded-lg border border-gray-300 text-sm w-full resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Yes, cancel job"}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setReason("");
              }}
              disabled={cancelling}
              className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition disabled:opacity-50"
            >
              Never mind
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelJob;
