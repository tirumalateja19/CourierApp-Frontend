import { useState } from "react";
import boxes from "../assets/boxes.png";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";

const AdminLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const reset = () => {
    setError(null);
    setUserName("");
    setPassword("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginAdmin({ userName, password });
      navigate("/admin/layout");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-contain bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${boxes})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="backdrop-blur-md bg-white/20 border border-white/70 shadow-2xl 
                      rounded-3xl p-10 w-[90%] max-w-sm flex flex-col gap-3"
      >
        <h2 className="text-black text-3xl font-serif text-center tracking-wide">
          Admin Login
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
              id="userName"
              name="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="p-3 w-full rounded-xl bg-white/40 border border-white/30 
                     text-black placeholder:text-black focus:outline-none"
            />
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mt-2 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="p-3 w-full rounded-xl bg-white/20 border border-white/30 
                     text-blac focus:outline-none"
            />
          </div>
          <div className="flex flex-col mt-2 gap-4 sm:flex-row sm:gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-32 sm:w-40 mt-4 bg-white/30 backdrop-blur-sm text-black font-semibold 
               py-2.5 rounded-xl hover:bg-white/40 transition cursor-pointer"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={reset}
              disabled={submitting}
              className="w-32 sm:w-40 mt-4 bg-white/30 backdrop-blur-sm text-black font-semibold 
               py-2.5 rounded-xl hover:bg-white/40 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
