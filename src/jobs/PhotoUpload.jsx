import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const LABEL_OPTIONS = [
  { value: "id_proof", label: "ID Proof" },
  { value: "waybill", label: "Waybill" },
  { value: "invoice", label: "Invoice" },
  { value: "packed_box", label: "Packed Box" },
  { value: "item_evidence", label: "Item Evidence" },
];

const PhotoUpload = ({ jobId }) => {
  const [label, setLabel] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [lastUploadedUrl, setLastUploadedUrl] = useState(null);
  const formRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!label) {
      toast.error("Pick a label first");
      return;
    }
    if (!file) {
      toast.error("Pick a photo first");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("label", label);

    setUploading(true);
    try {
      const response = await api.post(
        `/api/jobs/pickup/${jobId}/photos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      toast.success(response.data.message || "Photo uploaded");
      setLastUploadedUrl(response.data.photo.fileUrl);
      setLabel("");
      setFile(null);
      formRef.current?.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form
        ref={formRef}
        onSubmit={handleUpload}
        className="flex flex-col gap-3"
      >
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 text-sm w-full"
        >
          <option value="">Select label</option>
          {LABEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          id="photo-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="photo-file-input"
          className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
        >
          <Upload className="size-4 shrink-0" />
          <span className="truncate">
            {file ? file.name : "Click to choose a photo"}
          </span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="self-start text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload photo"}
        </button>
      </form>

      {lastUploadedUrl && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Last uploaded:</p>
          <a href={lastUploadedUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={lastUploadedUrl}
              alt="Last uploaded"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
