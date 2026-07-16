import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setError(null);
    setOldPassword("");
    setPassword("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.patch("/api/auth/change-password", {
        oldPassword,
        password,
      });

      toast.success(res.data.message || "Password Updated");
      reset();
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-24">
        <div
          className="backdrop-blur-md bg-white/20 border border-white/70 shadow-2xl 
                      rounded-3xl p-10 w-[90%] max-w-sm flex flex-col gap-3"
        >
          <h2 className="text-black text-3xl font-serif text-center tracking-wide">
            Change Password
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
                htmlFor="password"
                className="block text-sm font-medium text-black mt-3 mb-1"
              >
                Old Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="input validator bg-white/20 border border-white/30 
                     text-black focus:outline-none"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mt-3 mb-1"
              >
                New Password
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
            </div>
            <div className="flex flex-col mt-2 gap-4 sm:flex-row sm:gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-32 sm:w-40 mt-4 bg-white/30 backdrop-blur-sm text-black font-semibold 
               py-2.5 rounded-xl hover:bg-white/40 transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Updating..." : "update"}
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
    </div>
  );
};

export default ChangePassword;
