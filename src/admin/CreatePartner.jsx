import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const CreatePartner = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setError(null);
    setUserName("");
    setPassword("");
    setContactNumber("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post("/api/admin/create-partner", {
        userName,
        password,
        contactNumber,
      });

      toast.success(res.data.message || "Partner created successfully");
      reset();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create partner");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-24">
      <div
        className="backdrop-blur-md bg-white/20 border border-white/70 shadow-2xl 
                      rounded-3xl p-10 w-[90%] max-w-sm flex flex-col gap-3"
      >
        <h2 className="text-black text-3xl font-serif text-center tracking-wide">
          Create Partner
        </h2>
        {error && (
          <div
            className="text-sm text-red-500 text-center bg-red-500/10 
                  border border-red-500/20 rounded-lg py-2 px-3"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-black mt-2 mb-1"
            >
              UserName
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="input validator bg-white/20 border border-white/30 
                     text-black focus:outline-none"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
            />
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mt-3 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input validator bg-white/20 border border-white/30 
                     text-black focus:outline-none"
              required
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-black mt-3 mb-1"
            >
              Contact
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="input validator bg-white/20 border border-white/30 
                     text-black focus:outline-none"
              required
              placeholder="Contact number"
            />
          </div>
          <div className="flex flex-col mt-2 gap-4 sm:flex-row sm:gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-32 sm:w-40 mt-4 bg-white/30 backdrop-blur-sm text-black font-semibold 
               py-2.5 rounded-xl hover:bg-white/40 transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              onClick={reset}
              disabled={submitting}
              className="w-32 sm:w-40 mt-4 bg-white/30 backdrop-blur-sm text-black font-semibold 
               py-2.5 rounded-xl hover:bg-white/40 transition disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePartner;
