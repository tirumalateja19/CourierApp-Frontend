import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../api/axios";

const initialForm = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const resetForm = () => {
    setFormData(initialForm);
    setError("");

    setShowOldPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const passwordStrength = () => {
    const password = formData.password;

    if (!password) return null;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2)
      return {
        text: "Weak",
        color: "bg-red-500",
        width: "w-1/3",
      };

    if (score <= 4)
      return {
        text: "Medium",
        color: "bg-yellow-500",
        width: "w-2/3",
      };

    return {
      text: "Strong",
      color: "bg-green-500",
      width: "w-full",
    };
  };

  const strength = passwordStrength();

  const passwordsMatch =
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const passwordsDontMatch =
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  const samePassword =
    formData.oldPassword &&
    formData.password &&
    formData.oldPassword === formData.password;

  const canSubmit =
    passwordsMatch &&
    !samePassword &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (samePassword) {
      setError("New password cannot be the same as the current password.");
      return;
    }

    if (passwordsDontMatch) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.patch(
        "/api/auth/change-password",
        {
          oldPassword: formData.oldPassword,
          password: formData.password,
        }
      );

      toast.success(data.message || "Password updated successfully");
      resetForm();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-24 flex justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">

        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Change Password
        </h2>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Old Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Password
            </label>

            <div className="relative">
              <input
                type={
                  showOldPassword
                    ? "text"
                    : "password"
                }
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Current password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                className="w-full rounded-lg border border-gray-300 py-3 px-4 pr-11 outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowOldPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showOldPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="New password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                className="w-full rounded-lg border border-gray-300 py-3 px-4 pr-11 outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {strength && (
              <div className="mt-3">

                <div className="mb-1 flex justify-between text-xs text-gray-600">
                  <span>Password Strength</span>
                  <span>{strength.text}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}
                  />
                </div>

              </div>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-300 py-3 px-4 pr-11 outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {passwordsMatch && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Passwords match
              </p>
            )}

            {passwordsDontMatch && (
              <p className="mt-2 text-sm text-red-500">
                ✗ Passwords do not match
              </p>
            )}

            {samePassword && (
              <p className="mt-2 text-sm text-red-500">
                ✗ New password cannot be the same as your current password.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
            >
              Clear
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
