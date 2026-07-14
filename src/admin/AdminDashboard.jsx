import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "created", label: "Created" },
  { value: "assigned", label: "Assigned" },
  { value: "en_route", label: "En_route" },
  { value: "picked_up", label: "Picked_up" },
  { value: "at_office", label: "At_office" },
  { value: "dispatched", label: "Dispatched" },
];

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(true);

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

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (assignedToFilter) params.assignedToId = assignedToFilter;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;

        const response = await api.get("/api/jobs", { params });
        setJobs(response.data.totalJobs);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [statusFilter, assignedToFilter, fromDate, toDate]);

  return (
    <div className="p-2">
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium text-black mb-1"
          >
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg border border-gray-200 text-gray-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="assignedToFilter"
            className="block text-sm font-medium text-black mb-1"
          >
            Assigned To
          </label>
          <select
            id="assignedToFilter"
            value={assignedToFilter}
            onChange={(e) => setAssignedToFilter(e.target.value)}
            disabled={partnersLoading}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-50"
          >
            <option value="">All</option>
            {partners.map((partner) => (
              <option key={partner._id} value={partner._id}>
                {partner.userName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="fromDate"
            className="block text-sm font-medium text-black mb-1"
          >
            From
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 rounded-lg border border-gray-200 text-black"
          />
        </div>

        <div>
          <label
            htmlFor="toDate"
            className="block text-sm font-medium text-black mb-1"
          >
            To
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 rounded-lg border border-gray-200 text-black"
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
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/admin/jobs/${job._id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-black capitalize">
                    {job.clientName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {job.clientAddress}, {job.clientCity}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {job.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
