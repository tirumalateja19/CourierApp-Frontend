import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from "../api/axios";

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null); 

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/admin/partners");
        setPartners(response.data.partners);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load partners");
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const handleToggle = async (partner) => {
    setTogglingId(partner._id);
    try {
      const action = partner.isDeactivated ? "activate" : "deactivate";
      const response = await api.patch(
        `/api/admin/partners/${partner._id}/${action}`,
      );

      setPartners((prev) =>
        prev.map((p) =>
          p._id === partner._id ? { ...p, isDeactivated: !p.isDeactivated } : p,
        ),
      );
      toast.success(response.data.message || `Partner ${action}d successfully`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Partners</h1>
        <Link
          to="/admin/jobs/create-partner"
          className="px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          + Create Partner
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading partners...</p>}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && partners.length === 0 && (
        <p className="text-gray-500">No partners found.</p>
      )}

      {!loading && !error && partners.length > 0 && (
        <div className="grid gap-3">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4"
            >
              <div>
                <p className="font-semibold text-black capitalize">{partner.userName}</p>
                <p className="text-sm text-gray-600">{partner.contactNumber}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    partner.isDeactivated
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {partner.isDeactivated ? "Deactivated" : "Active"}
                </span>

                <button
                  onClick={() => handleToggle(partner)}
                  disabled={togglingId === partner._id}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                    partner.isDeactivated
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {togglingId === partner._id
                    ? "..."
                    : partner.isDeactivated
                      ? "Activate"
                      : "Deactivate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
