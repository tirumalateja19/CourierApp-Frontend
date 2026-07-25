import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const PACKING_OPTIONS = [
  { value: "packed_at_source", label: "Packed at client" },
  { value: "packed_at_office", label: "Packed at Office" },
];

const emptyPackage = () => ({
  weight: "",
  length: "",
  breadth: "",
  height: "",
});

const JobDetailsForm = ({ jobData, jobId, setJobData }) => {
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

  const [packingStatus, setPackingStatus] = useState(
    jobData.packingStatus || "",
  );
  const [price, setPrice] = useState(jobData.price || "");
  const [numberOfPackages, setNumberOfPackages] = useState(
    jobData.numberOfPackages || "",
  );

  const [packages, setPackages] = useState(() => {
    if (jobData.packages && jobData.packages.length > 0)
      return jobData.packages;
    const n = parseInt(jobData.numberOfPackages, 10) || 0;
    return Array.from({ length: n }, emptyPackage);
  });

  const [savingPackage, setSavingPackage] = useState(false);

  const handleNumberOfPackagesChange = (value) => {
    setNumberOfPackages(value);
    const n = parseInt(value, 10) || 0;
    setPackages((prev) => {
      const next = [...prev];
      while (next.length < n) next.push(emptyPackage());
      return next.slice(0, n);
    });
  };

  const updatePackageField = (index, field, value) => {
    setPackages((prev) =>
      prev.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg)),
    );
  };

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
        packages,
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

      <form onSubmit={handleSavePackage} className="flex flex-col gap-3">
        <h3 className="font-semibold text-black">Package Info</h3>
        <div className="flex gap-2">
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
            min="0"
            onChange={(e) => handleNumberOfPackagesChange(e.target.value)}
            className={inputClass}
          />
        </div>

        {packages.map((pkg, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">Package {index + 1}</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={pkg.weight}
                onChange={(e) =>
                  updatePackageField(index, "weight", e.target.value)
                }
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Length"
                value={pkg.length}
                onChange={(e) =>
                  updatePackageField(index, "length", e.target.value)
                }
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Breadth"
                value={pkg.breadth}
                onChange={(e) =>
                  updatePackageField(index, "breadth", e.target.value)
                }
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Height"
                value={pkg.height}
                onChange={(e) =>
                  updatePackageField(index, "height", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        ))}

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
