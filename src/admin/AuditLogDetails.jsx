import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import api from "../api/axios";

const ACTION_LABELS = {
  jobCreated: "Job created",
  jobAssigned: "Job assigned",
  statusUpdated: "Status updated",
  pdfGenerated: "Document generated",
  pdfRegenerated: "Document regenerated",
  jobAutoLocked: "Job auto-locked",
  jobLocked: "Job locked",
  jobUnlocked: "Job unlocked",
  itemsEdited: "Items edited",
  jobDispatched: "Job dispatched",
};

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

const formatTimestamp = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${time}`;
};

// actorId missing means a system-triggered event (e.g. background PDF job),
// not a human actor — show "System" rather than a blank/undefined name.
const formatActor = (log) => {
  if (!log.actorId || log.actorRole === "system") return "System";
  return log.actorRole
    ? log.actorRole.charAt(0).toUpperCase() + log.actorRole.slice(1)
    : "Unknown";
};

const AuditLogDetail = () => {
  const { jobId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/admin/audit-logs/${jobId}`);
        setLogs(response.data.logs || response.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load audit log");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [jobId]);

  return (
    <div className="p-2">
      <Link
        to="/admin/audit-logs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition mb-4"
      >
        <ArrowLeft className="size-4" />
        Back to audit log
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-black mb-6">Job timeline</h2>

        {loading && (
          <p className="text-gray-500 text-sm">Loading timeline...</p>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
            {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No events recorded yet.
          </p>
        )}

        {!loading && !error && logs.length > 0 && (
          <div className="flex flex-col">
            {logs.map((log, index) => {
              const isLast = index === logs.length - 1;
              return (
                <div key={log._id || index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-2.5 rounded-full bg-black mt-1.5" />
                    {!isLast && (
                      <div className="w-px flex-1 bg-gray-200 min-h-9" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-black">
                      {ACTION_LABELS[log.action] || log.action}
                    </p>
                    {log.previousStatus && log.newStatus && (
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">
                        {log.previousStatus} → {log.newStatus}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatActor(log)} · {formatTimestamp(log.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogDetail;
