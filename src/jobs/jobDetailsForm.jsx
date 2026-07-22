import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const PACKING_OPTIONS = [
  { value: "packed_at_source", label: "Packed at client" },
  { value: "packed_at_office", label: "Packed at Office" },
];

const JobDetailsForm = ({ jobData, jobId, setJobData }) => {
  // Receiver details group
  const [receiverName, setReceiverName] = useState(jobData.receiverName || "");
  const [receiverNumber, setReceiverNumber] = useState(
    jobData.receiverNumber || "",
  );
  const [receiverAddress, setReceiverAddress] = useState(
    jobData.receiverAddress || "",
  );
  const [receiverCity, setReceiverCity] = useState(jobData.receiverCity || "");
  const [receiverZipCode, setReceiverZipCode] = useState(
    jobData.receiverZipCode || "",
  );
  const [savingReceiver, setSavingReceiver] = useState(false);

  // Package info group
  const [weight, setWeight] = useState(jobData.weight || "");
  const [dimensionsLength, setDimensionsLength] = useState(
    jobData.dimensionsLength || "",
  );
  const [dimensionsBreadth, setDimensionsBreadth] = useState(
    jobData.dimensionsBreadth || "",
  );
  const [dimensionsHeight, setDimensionsHeight] = useState(
    jobData.dimensionsHeight || "",
  );
  const [packingStatus, setPackingStatus] = useState(
    jobData.packingStatus || "",
  );
  const [price, setPrice] = useState(jobData.price || "");
  const [numberOfPackages, SetNumberOfPackages] = useState(
    jobData.numberOfPackages || "",
  );
  const [savingPackage, setSavingPackage] = useState(false);

  const handleSaveReceiver = async (e) => {
    e.preventDefault();
    setSavingReceiver(true);
    try {
      const response = await api.patch(`/api/jobs/pickup/${jobId}/details`, {
        receiverName,
        receiverNumber,
        receiverAddress,
        receiverCity,
        receiverZipCode,
      });
      // Merge the updated fields into the parent's jobData rather than
      // replacing it wholesale — we only sent/received a subset of fields.
      setJobData((prev) => ({ ...prev, ...response.data.jobData }));
      toast.success("Receiver details saved");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to save receiver details",
      );
    } finally {
      setSavingReceiver(false);
    }
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    setSavingPackage(true);
    try {
      const response = await api.patch(`/api/jobs/pickup/${jobId}/details`, {
        weight,
        dimensionsLength,
        dimensionsBreadth,
        dimensionsHeight,
        packingStatus,
        price,
        numberOfPackages,
      });
      setJobData((prev) => ({ ...prev, ...response.data.jobData }));
      toast.success("Package info saved");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to save package info",
      );
    } finally {
      setSavingPackage(false);
    }
  };

  const inputClass = "p-2 rounded-lg border border-gray-300 text-sm w-full";

  return (
    <div className="flex flex-col gap-6">
      {/* Receiver Details */}
      <form onSubmit={handleSaveReceiver} className="flex flex-col gap-2">
        <h3 className="font-semibold text-black">Receiver Details</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Receiver Name"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="Receiver Number"
            value={receiverNumber}
            onChange={(e) => setReceiverNumber(e.target.value)}
            className={inputClass}
          />
        </div>
        <input
          type="text"
          placeholder="Receiver Address"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          className={inputClass}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="City"
            value={receiverCity}
            onChange={(e) => setReceiverCity(e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={receiverZipCode}
            onChange={(e) => setReceiverZipCode(e.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={savingReceiver}
          className="self-start text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {savingReceiver ? "Saving..." : "Save Receiver Details"}
        </button>
      </form>

      {/* Package Info */}
      <form onSubmit={handleSavePackage} className="flex flex-col gap-2">
        <h3 className="font-semibold text-black">Package Info</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Number of Packages"
            value={numberOfPackages}
            onChange={(e) => SetNumberOfPackages(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Length"
            value={dimensionsLength}
            onChange={(e) => setDimensionsLength(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Breadth"
            value={dimensionsBreadth}
            onChange={(e) => setDimensionsBreadth(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Height"
            value={dimensionsHeight}
            onChange={(e) => setDimensionsHeight(e.target.value)}
            className={inputClass}
          />
        </div>
        <select
          value={packingStatus}
          onChange={(e) => setPackingStatus(e.target.value)}
          className={inputClass}
        >
          <option value="">Select packing status</option>
          {PACKING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={savingPackage}
          className="self-start text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {savingPackage ? "Saving..." : "Save Package Info"}
        </button>
      </form>
    </div>
  );
};

export default JobDetailsForm;
