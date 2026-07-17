import { useState } from "react";
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

  const handleFileChange = (e) => {
    // File inputs are always "uncontrolled" in the sense that you can't set
    // their value programmatically — you only read what the user picked.
    // e.target.files is a FileList; we just want the first (only) file.
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

    // Unlike every other request so far, this body can't be a plain JS
    // object — it has to be FormData, which is how the browser packages
    // a file for upload alongside other fields.
    const formData = new FormData();
    formData.append("photo", file); // key name must match backend's Multer field name
    formData.append("label", label);

    setUploading(true);
    try {
      const response = await api.post(
        `/api/jobs/pickup/${jobId}/photos`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success(response.data.message || "Photo uploaded");
      setLastUploadedUrl(response.data.photo.fileUrl);
      setLabel("");
      setFile(null);
      e.target.reset(); // clears the native file input's displayed filename
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleUpload}
        className="flex flex-wrap gap-2 items-center"
      >
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 text-sm"
        >
          <option value="">Select label</option>
          {LABEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />

        <button
          type="submit"
          disabled={uploading}
          className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>

      {/* Transient confirmation — only shows the most recent upload this
          session, built from the POST response, not fetched from a GET. */}
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
