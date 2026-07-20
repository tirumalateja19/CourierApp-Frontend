import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../api/axios";
import Items from "../jobs/Items";
import JobDetailsForm from "../jobs/JobDetailsForm";
import PhotoUpload from "../jobs/PhotoUpload";
import SubmitSection from "../jobs/SubmitSection";

const PartnerJobDetail = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/partner/jobs/${id}`);
        setJobData(response.data.jobData);
        setItems(response.data.items);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-2">Loading job...</div>;
  if (error) return <div className="p-2 text-red-600">{error}</div>;
  if (!jobData) return <div className="p-2">Job not found</div>;

  const {
    clientName,
    clientNumber,
    clientAddress,
    clientCity,
    networkName,
    assignedTo,
    status,
  } = jobData;

  return (
    <div className="p-2">
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-black mb-1">{clientName}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
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

        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-black mb-2">Items</h3>
          <Items items={items} jobId={id} setItems={setItems} />
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <PhotoUpload jobId={id} />
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <JobDetailsForm
            jobData={jobData}
            jobId={id}
            setJobData={setJobData}
          />
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <SubmitSection jobData={jobData} jobId={id} setJobData={setJobData} />
        </div>
      </div>
    </div>
  );
};

export default PartnerJobDetail;
