import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import api from "../api/axios";

const RANGE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "week", label: "7D" },
  { value: "month", label: "MTD" },
  { value: "all", label: "All" },
  { value: "custom", label: "Custom" },
];

const STATUS_META = {
  Open: { color: "#2563EB", key: "open" },
  Completed: { color: "#16A34A", key: "completed" },
  Cancelled: { color: "#DC2626", key: "cancelled" },
};

const toDateInputValue = (date) => date.toISOString().slice(0, 10);

const getPresetRange = (preset) => {
  const now = new Date();
  const to = toDateInputValue(now);

  if (preset === "today") return { from: to, to };
  if (preset === "week") {
    const from = new Date(now);
    from.setDate(from.getDate() - 6);
    return { from: toDateInputValue(from), to };
  }
  if (preset === "month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: toDateInputValue(from), to };
  }
  if (preset === "all") return { from: "", to: "" };
  return null;
};

const StatCard = ({ label, value, total, accent, isTotal }) => {
  const pct = isTotal || !total ? 100 : Math.round((value / total) * 100);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
      <p
        className="text-3xl font-bold tabular-nums"
        style={{ color: isTotal ? "#111827" : accent }}
      >
        {value ?? 0}
      </p>
      <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      {!isTotal && (
        <p className="mt-1.5 text-xs text-gray-400">{pct}% of total</p>
      )}
    </div>
  );
};

const AdminStats = () => {
  const [preset, setPreset] = useState("week");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom mode reads fromDate/toDate straight from state; presets are
  // derived on the fly below, so there's no setState-in-effect chain.
  const activeRange =
    preset === "custom"
      ? { from: fromDate, to: toDate }
      : getPresetRange(preset);

  useEffect(() => {
    if (
      !activeRange ||
      (preset === "custom" && (!activeRange.from || !activeRange.to))
    )
      return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/admin/jobs/stats", {
          params: { fromDate: activeRange.from, toDate: activeRange.to },
        });
        setStats(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, activeRange?.from, activeRange?.to]);

  const chartData = stats
    ? Object.entries(STATUS_META)
        .map(([name, meta]) => ({
          name,
          value: stats[meta.key],
          color: meta.color,
        }))
        .filter((d) => d.value > 0)
    : [];

  return (
    <div className="p-2">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          {RANGE_PRESETS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPreset(opt.value)}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                preset === opt.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {preset === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700"
            />
            <span className="text-gray-400 text-sm">&rarr;</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700"
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-gray-400" />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4">
          <div className="grid grid-cols-2 gap-3 content-start">
            <div className="col-span-2">
              <StatCard
                label="Total Jobs"
                value={stats.totalJobs}
                isTotal
                accent="#111827"
              />
            </div>
            <StatCard
              label="Open"
              value={stats.open}
              total={stats.totalJobs}
              accent="#2563EB"
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              total={stats.totalJobs}
              accent="#16A34A"
            />
            <div className="col-span-2">
              <StatCard
                label="Cancelled"
                value={stats.cancelled}
                total={stats.totalJobs}
                accent="#DC2626"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center min-h-70">
            {chartData.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-10">
                No jobs found in this date range.
              </p>
            ) : (
              <div className="relative w-full">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={64}
                      outerRadius={92}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #E5E7EB",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: "#6B7280", fontSize: 12 }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 top-0 bottom-8 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-gray-900">
                    {stats.totalJobs}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    jobs
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
