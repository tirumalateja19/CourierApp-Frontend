import { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import api from "../api/axios";
import JobDetailsForm from "../jobs/jobDetailsForm";
import Items from "../jobs/items";
import PhotoUpload from "../jobs/photoUpload";
import PdfDownloads from "./PdfDownloads";
import AdminSubmit from "./AdminSubmit";
import GenerateInvoice from "./GenerateInvoice";
import Shipment from "../components/Shipment";

const LOCK_REASONS = [
  { value: "review", label: "Review" },
  { value: "dispatched", label: "Dispatched" },
  { value: "dispute", label: "Dispute" },
  { value: "mismatch", label: "Mismatch" },
];

const STATUS_OPTIONS = [
  { value: "picked_up", label: "Picked Up" },
  { value: "at_office", label: "At Office" },
];

const AdminJobDetail = () => {
  const { id } = useParams();

  const [jobData, setJobData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [lockReason, setLockReason] = useState("");
  const [lockingOrUnlocking, setLockingOrUnlocking] = useState(false);

  const [statusValue, setStatusValue] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/jobs/${id}`);
        setJobData(response.data.jobData);
        setItems(response.data.items);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const fetchPartners = async () => {
      setPartnersLoading(true);
      try {
        const response = await api.get("/api/admin/partners");
        setPartners(response.data.partners);
      } catch (err) {
        console.error("Failed to load partners", err);
      } finally {
        setPartnersLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const handleAssign = async () => {
    if (!selectedPartnerId) {
      toast.error("Pick a partner first");
      return;
    }
    setAssigning(true);
    try {
      const response = await api.patch(`/api/jobs/${id}/assign`, {
        partnerId: selectedPartnerId,
      });
      setJobData(response.data.jobData);
      toast.success(response.data.message || "Job assigned");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign job");
    } finally {
      setAssigning(false);
    }
  };

  const handleSelfAssign = async () => {
    setAssigning(true);
    try {
      const response = await api.patch(`/api/jobs/${id}/self-assign`);
      setJobData(response.data.jobData);
      toast.success(response.data.message || "Job self-assigned");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to self-assign job");
    } finally {
      setAssigning(false);
    }
  };

  const handleLock = async () => {
    if (!lockReason) {
      toast.error("Pick a lock reason first");
      return;
    }
    setLockingOrUnlocking(true);
    try {
      const response = await api.patch(`/api/jobs/${id}/lock`, {
        lockedReason: lockReason,
      });
      setJobData(response.data.jobData);
      toast.success(response.data.message || "Job locked");
      setLockReason("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to lock job");
    } finally {
      setLockingOrUnlocking(false);
    }
  };

  const handleUnlock = async () => {
    setLockingOrUnlocking(true);
    try {
      const response = await api.patch(`/api/jobs/${id}/unlock`);
      setJobData(response.data.jobData);
      toast.success(response.data.message || "Job unlocked");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to unlock job");
    } finally {
      setLockingOrUnlocking(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusValue) {
      toast.error("Pick a status first");
      return;
    }
    setUpdatingStatus(true);
    try {
      const response = await api.patch(`/api/jobs/${id}/status`, {
        status: statusValue,
      });
      setJobData(response.data.jobData);
      toast.success(response.data.message || "Status updated");
      setStatusValue("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <div className="p-2">Loading job...</div>;
  if (error) return <div className="p-2 text-red-600">{error}</div>;
  if (!jobData) return <div className="p-2">Job not found</div>;

  const {
    clientName,
    clientNumber,
    clientAddress,
    clientCity,
    status,
    locked,
    assignedTo,
    networkName,
  } = jobData;

  return (
    <div className="p-2">
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl flex flex-col gap-6">
        <div>
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-black mb-1">{clientName}</h2>
            <div className="flex gap-2 items-center">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {status}
              </span>
              {locked && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                  Locked
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {clientAddress}, {clientCity}
          </p>
          <p className="text-sm text-gray-600">{clientNumber}</p>
          {networkName && (
            <p className="text-sm text-gray-500">Network: {networkName}</p>
          )}
          <p className="text-sm text-gray-600 capitalize">
            Assigned to:{" "}
            {assignedTo || (
              <span className="italic text-gray-400">Unassigned</span>
            )}
          </p>
        </div>

        {/* Assign / Self-assign — only shown before a job has been picked up */}
        {status === "created" && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-black mb-2">Assign Job</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                disabled={partnersLoading}
                className="p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select a partner</option>
                {partners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.userName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
              >
                {assigning ? "..." : "Assign"}
              </button>
              <span className="text-sm text-gray-400">or</span>
              <button
                onClick={handleSelfAssign}
                disabled={assigning}
                className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition disabled:opacity-50"
              >
                Self-Assign
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-black mb-2">Update Status</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 text-sm"
            >
              <option value="">Select new status</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={updatingStatus}
              className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
            >
              {updatingStatus ? "..." : "Update Status"}
            </button>
          </div>
        </div>

        {/* Lock / Unlock */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-black mb-2">Lock / Unlock</h3>
          {locked ? (
            <button
              onClick={handleUnlock}
              disabled={lockingOrUnlocking}
              className="text-sm px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {lockingOrUnlocking ? "..." : "Unlock Job"}
            </button>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select a reason</option>
                {LOCK_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLock}
                disabled={lockingOrUnlocking}
                className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {lockingOrUnlocking ? "..." : "Lock Job"}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-black mb-2">Items</h3>
          <Items items={items} jobId={id} setItems={setItems} />
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <PhotoUpload jobId={id} />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <JobDetailsForm
            jobData={jobData}
            jobId={id}
            setJobData={setJobData}
          />
        </div>
        <div>
          <AdminSubmit jobData={jobData} jobId={id} setJobData={setJobData} />
          <GenerateInvoice jobData={jobData} jobId={id} />
          <PdfDownloads jobId={id} />
        </div>
        <div>
          <Shipment jobData={jobData} jobId={id} setJobData={setJobData} />
        </div>
      </div>
    </div>
  );
};

export default AdminJobDetail;
