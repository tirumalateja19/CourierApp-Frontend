import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, Calendar, Search, RefreshCcw } from "lucide-react";
import api from "../api/axios";

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

const AuditLogList = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [clientNameFilter, setClientNameFilter] = useState("");

  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(true);

  // 1. Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setClientNameFilter(searchInput);
      setCurrentPage(1); // Reset page to 1 when a new search executes
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 2. Fetch Partners for the dropdown
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

  // 3. Fetch Jobs with standard pagination
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { page: currentPage, limit: 10 };
        if (assignedToFilter) params.assignedToId = assignedToFilter;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;
        if (clientNameFilter) params.clientName = clientNameFilter;

        const response = await api.get("/api/jobs/auditedJobs", { params });

        // Replaces the array completely instead of appending (like infinite scroll did)
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [assignedToFilter, fromDate, toDate, clientNameFilter, currentPage]);

  return (
    <div className="p-2">
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-full border border-gray-400 bg-white text-sm text-gray-700">
          <Search className="size-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search client name"
            className="bg-transparent focus:outline-none text-sm w-40"
          />
        </div>

        <PillSelect
          value={assignedToFilter}
          onChange={(e) => {
            setAssignedToFilter(e.target.value);
            setCurrentPage(1);
          }}
          disabled={partnersLoading}
        >
          <option value="">Assigned to</option>
          {partners.map((partner) => (
            <option key={partner._id} value={partner._id}>
              {partner.userName}
            </option>
          ))}
        </PillSelect>

        <div className="relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700">
          <Calendar className="size-4 text-gray-400" />
          <span className="text-gray-400">From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>

        <div className="relative flex items-center gap-2 pl-4 pr-3 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700">
          <Calendar className="size-4 text-gray-400" />
          <span className="text-gray-400">To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent focus:outline-none text-sm"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <RefreshCcw size={32} className="animate-spin text-black" />
        </div>
      )}

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
          {jobs.map((job) => (
            <button
              key={job._id}
              onClick={() => navigate(`/admin/audit-logs/${job._id}`)}
              className="flex items-center justify-between text-left gap-4 bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition"
            >
              <div className="min-w-0">
                <p className="font-semibold text-black capitalize truncate">
                  {job.clientName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {job.clientAddress}, {job.clientCity}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition">
                View audit log
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Standard Numbered Pagination matching AdminDashboard */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogList;
