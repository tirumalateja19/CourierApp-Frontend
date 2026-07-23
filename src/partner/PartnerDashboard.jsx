import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, Calendar, Lock } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "Created", label: "Created" },
  { value: "Assigned", label: "Assigned" },
  { value: "PickedUp", label: "Picked Up" },
  { value: "AtOffice", label: "At Office" },
  { value: "Dispatched", label: "Dispatched" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDateBadge = (isoString) => {
  if (!isoString) return { day: "--", month: "" };
  const d = new Date(isoString);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: MONTHS[d.getMonth()],
  };
};

const STATUS_DOT_COLOR = {
  Assigned: "bg-blue-500",
  PickedUp: "bg-purple-500",
  AtOffice: "bg-indigo-500",
  Dispatched: "bg-green-500",
};

const PillSelect = ({ children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className="appearance-none pl-4 pr-8 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none"
    >
      {children}
    </select>
    <ChevronDown className="size-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

const PartnerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;

        const response = await api.get("/api/partner/jobs", { params });
        setJobs(response.data.jobs);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [statusFilter, fromDate, toDate]);

  const handleJobClick = (job) => {
    if (job.locked) {
      toast.error("Cannot access — this job is locked");
      return;
    }
    navigate(`/partner/jobs/${job._id}`);
  };

  return (
    <div className="p-2">
      {/* Pill filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <PillSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </PillSelect>

        <div className="relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700">
          <Calendar className="size-4 text-gray-400" />
          <span className="text-gray-400">From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>

        <div className="relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700">
          <Calendar className="size-4 text-gray-400" />
          <span className="text-gray-400">To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading jobs...</p>}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-gray-500">No jobs found.</p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => {
            const { day, month } = formatDateBadge(job.scheduledTime);
            const dotColor = STATUS_DOT_COLOR[job.status] || "bg-gray-400";

            return (
              <div
                key={job._id}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4"
              >
                {/* Date badge */}
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl border border-gray-200 shrink-0">
                  <span className="text-lg font-semibold text-black leading-none">
                    {day}
                  </span>
                  <span className="text-xs text-gray-500">{month}</span>
                </div>

                {/* Title + address */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black capitalize truncate">
                    {job.clientName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {job.clientAddress}, {job.clientCity}
                  </p>
                </div>

                {/* Location / Status / Network */}
                <div className="hidden md:flex flex-col text-sm w-32 shrink-0">
                  <span className="text-gray-400 text-xs">Location</span>
                  <span className="text-black truncate">{job.clientCity}</span>
                </div>

                <div className="hidden md:flex flex-col text-sm w-32 shrink-0">
                  <span className="text-gray-400 text-xs">Status</span>
                  <span className="flex items-center gap-1.5 text-black capitalize">
                    <span className={`size-2 rounded-full ${dotColor}`} />
                    {job.status}
                    {job.locked && <Lock className="size-3.5 text-red-600" />}
                  </span>
                </div>

                <div className="hidden md:flex flex-col text-sm w-32 shrink-0">
                  <span className="text-gray-400 text-xs">Network</span>
                  <span className="text-black truncate">
                    {job.networkName || "—"}
                  </span>
                </div>

                <button
                  onClick={() => handleJobClick(job)}
                  className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition ${
                    job.locked
                      ? "border-red-300 text-red-600 hover:bg-red-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  View details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
