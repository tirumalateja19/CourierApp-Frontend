import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const CreateJob = () => {
  const [clientName, setClientName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [approxWeight, setApproxWeight] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [networkName, setNetworkName] = useState("");

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setError(null);
    setClientName("");
    setClientNumber("");
    setClientAddress("");
    setClientCity("");
    setApproxWeight("");
    setScheduledTime("");
    setNetworkName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await api.post("/api/jobs/new-job", {
        clientName,
        clientNumber,
        clientAddress,
        clientCity,
        approxWeight,
        scheduledTime,
        networkName,
      });
      toast.success(response?.data?.message || "Job created");
      reset();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "input validator w-full bg-white/20 border border-white/30 text-black focus:outline-none";

  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-black mb-4">Create Job</h2>

        {error && (
          <div
            className="text-sm text-red-500 text-center bg-red-500/10 
                  border border-red-500/20 rounded-lg py-2 px-3 mb-3"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="clientName"
              className="block text-sm font-medium text-black mb-1"
            >
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              placeholder="clientName"
              onChange={(e) => setClientName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="clientNumber"
              className="block text-sm font-medium text-black mb-1"
            >
              Client Number
            </label>
            <input
              id="clientNumber"
              type="tel"
              value={clientNumber}
              placeholder="clientNumber"
              onChange={(e) => setClientNumber(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="clientAddress"
              className="block text-sm font-medium text-black mb-1"
            >
              Client Address
            </label>
            <input
              id="clientAddress"
              type="text"
              value={clientAddress}
              placeholder="clientAddress"
              onChange={(e) => setClientAddress(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="clientCity"
              className="block text-sm font-medium text-black mb-1"
            >
              Client City
            </label>
            <input
              id="clientCity"
              type="text"
              placeholder="clientCity"
              value={clientCity}
              onChange={(e) => setClientCity(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="approxWeight"
              className="block text-sm font-medium text-black mb-1"
            >
              Approx Weight
            </label>
            <input
              id="approxWeight"
              type="number"
              placeholder="approxWeight"
              value={approxWeight}
              onChange={(e) => setApproxWeight(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="scheduledTime"
              className="block text-sm font-medium text-black mb-1"
            >
              Scheduled Time
            </label>
            <input
              id="scheduledTime"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="networkName"
              className="block text-sm font-medium text-black mb-1"
            >
              Network Name
            </label>
            <input
              id="networkName"
              type="text"
              placeholder="networkName"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Job"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
