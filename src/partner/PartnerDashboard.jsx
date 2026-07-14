import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../api/axios";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "created", label: "Created" },
  { value: "assigned", label: "Assigned" },
  { value: "en_route", label: "En_route" },
  { value: "picked_up", label: "Picked_up" },
  { value: "at_office", label: "At_office" },
  { value: "dispatched", label: "Dispatched" },
];

const PartnerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");


  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (statusFilter) {
          params.status = statusFilter;
        }
        const response = await api.get("/api/partner/jobs", { params });
        setJobs(response.data.jobs);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [statusFilter]);

  return (
    <div className="p-2">

      <div className="mb-4">
        <label
          htmlFor="statusFilter"
          className="mr-2 text-sm font-medium text-black"
        >
          Filter by status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded-lg border border-gray-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
              to={`/partner/jobs/${job._id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-black">{job.clientName}</p>
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

export default PartnerDashboard;
