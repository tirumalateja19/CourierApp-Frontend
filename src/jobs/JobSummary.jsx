const STATUS_BADGE_COLOR = {
  created: "bg-gray-100 text-gray-700",
  assigned: "bg-blue-100 text-blue-700",
  en_route: "bg-amber-100 text-amber-700",
  picked_up: "bg-purple-100 text-purple-700",
  at_office: "bg-indigo-100 text-indigo-700",
  dispatched: "bg-green-100 text-green-700",
};

const INVOICE_LABEL = {
  generated_at_pickup: "Generated",
  pending_office_completion: "Pending office completion",
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

const formatScheduled = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${time}`;
};

const Row = ({ label, children }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    {children}
  </div>
);

const JobSummary = ({ jobData }) => {
  const badgeClass =
    STATUS_BADGE_COLOR[jobData.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
      <p className="text-xs text-gray-500">Job summary</p>

      <Row label="Status">
        <span
          className={`inline-block text-xs px-2.5 py-0.5 rounded-full capitalize ${badgeClass}`}
        >
          {jobData.status}
        </span>
      </Row>

      <Row label="Locked">
        <p className="text-sm text-black">{jobData.locked ? "Yes" : "No"}</p>
      </Row>

      <Row label="Assigned to">
        <p className="text-sm text-black capitalize">
          {jobData.assignedTo || "Unassigned"}
        </p>
      </Row>

      <Row label="Network">
        <p className="text-sm text-black">{jobData.networkName || "—"}</p>
      </Row>

      <Row label="Scheduled">
        <p className="text-sm text-black">
          {formatScheduled(jobData.scheduledTime)}
        </p>
      </Row>

      <Row label="Dispatched Time">
        <p className="text-sm text-black">
          {formatScheduled(jobData.dispatchedAt)}
        </p>
      </Row>

      <div className="border-t border-gray-200 pt-3">
        <Row label="Invoice">
          <p className="text-sm text-black">
            {INVOICE_LABEL[jobData.invoiceStatus] || (
              <span className="text-gray-400">Not generated yet</span>
            )}
          </p>
        </Row>
      </div>
    </div>
  );
};

export default JobSummary;
