import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

// Only relevant once paperwork (invoice/POD) exists for the job.
const Shipment = ({ jobData, jobId, setJobData }) => {
  const [trackingId, setTrackingId] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [recording, setRecording] = useState(false);

  if (!jobData.invoiceStatus) {
    return null;
  }

  const handleRecordShipment = async (e) => {
    e.preventDefault();
    setRecording(true);
    try {
      const body = { trackingId };
      // Backend prioritizes jobData.networkName over whatever's sent here —
      // only send it when the job doesn't already have one, since it'd be
      // silently ignored otherwise.
      if (!jobData.networkName && networkName) body.networkName = networkName;

      const response = await api.post(`/api/jobs/${jobId}/shipment`, body);
      toast.success(response.data.message || "Shipment recorded");

      // Response only returns { message, shipment } — the Shipment doc,
      // not the Job — so refetch the job to reflect status -> dispatched.
      const refreshed = await api.get(`/api/jobs/${jobId}`);
      setJobData(refreshed.data.jobData);

      setTrackingId("");
      setNetworkName("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to record shipment");
    } finally {
      setRecording(false);
    }
  };

  // Once dispatched, there's nothing left to record — show a summary instead.
  if (jobData.status === "dispatched") {
    return (
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-black mb-2">Shipment</h3>
        <p className="text-sm text-gray-600">Job has been dispatched.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="font-semibold text-black mb-2">Record Shipment</h3>
      <form
        onSubmit={handleRecordShipment}
        className="flex flex-wrap gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          required
          className="p-2 rounded-lg border border-gray-300 text-sm"
        />
        {jobData.networkName ? (
          <span className="text-sm text-gray-600">
            Network: {jobData.networkName}
          </span>
        ) : (
          <input
            type="text"
            placeholder="Network Name"
            value={networkName}
            onChange={(e) => setNetworkName(e.target.value)}
            required
            className="p-2 rounded-lg border border-gray-300 text-sm"
          />
        )}
        <button
          type="submit"
          disabled={recording}
          className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {recording ? "Recording..." : "Record Shipment"}
        </button>
      </form>
    </div>
  );
};

export default Shipment;
