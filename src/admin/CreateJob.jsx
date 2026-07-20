import { useState } from "react";
import { Truck } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const NETWORK_OPTIONS = ["FedEx", "UPS", "DHL", "DPD"];

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
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-black placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition";
  const labelClass = "block text-sm font-medium text-black mb-1.5";

  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-black mb-6">Create Job</h2>

        {error && (
          <div className="text-sm text-red-500 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="clientName" className={labelClass}>
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              placeholder="Client name"
              onChange={(e) => setClientName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientNumber" className={labelClass}>
                Client Number
              </label>
              <input
                id="clientNumber"
                type="tel"
                value={clientNumber}
                placeholder="Phone number"
                onChange={(e) => setClientNumber(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="clientCity" className={labelClass}>
                Client City
              </label>
              <input
                id="clientCity"
                type="text"
                placeholder="City"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="clientAddress" className={labelClass}>
              Client Address
            </label>
            <input
              id="clientAddress"
              type="text"
              value={clientAddress}
              placeholder="Street address"
              onChange={(e) => setClientAddress(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="approxWeight" className={labelClass}>
                Approx Weight
              </label>
              <input
                id="approxWeight"
                type="number"
                placeholder="kg"
                value={approxWeight}
                onChange={(e) => setApproxWeight(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="scheduledTime" className={labelClass}>
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
          </div>

          {/* Network — card selector, same pattern as a payment-method picker */}
          <div>
            <label className={labelClass}>Network</label>
            <div className="grid grid-cols-2 gap-3">
              {NETWORK_OPTIONS.map((network) => {
                const selected = networkName === network;
                return (
                  <button
                    key={network}
                    type="button"
                    onClick={() => setNetworkName(network)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${
                      selected
                        ? "border-black bg-gray-50 text-black"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Truck
                      className={`size-4 ${selected ? "text-black" : "text-gray-400"}`}
                    />
                    {network}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Job"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="w-full py-2 text-sm text-gray-500 hover:text-black transition"
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
