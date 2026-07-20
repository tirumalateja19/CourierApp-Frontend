import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import boxes from "../assets/boxes.png";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginAdmin, loginPartner } = useAuth();

  const [activeRole, setActiveRole] = useState(location.state?.preselectRole || "admin");

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setError(null);
    setUserName("");
    setPassword("");
  };

  const handleTabSwitch = (role) => {
    setActiveRole(role);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (activeRole === "admin") {
        await loginAdmin({ userName, password });
        navigate("/admin/dashboard");
      } else {
        await loginPartner({ userName, password });
        navigate("/partner/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const tabClass = (role) =>
    `flex-1 py-2 rounded-xl text-sm font-semibold transition ${
      activeRole === role
        ? "bg-white/40 text-black"
        : "text-black/60 hover:bg-white/20"
    }`;

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
          Login
        </h2>

        {/* Role tabs */}
        <div className="flex bg-white/10 border border-white/30 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => handleTabSwitch("admin")}
            className={tabClass("admin")}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("partner")}
            className={tabClass("partner")}
          >
            Partner
          </button>
        </div>

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input validator bg-white/20 border border-white/30 
                     text-black focus:outline-none w-full pr-10"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-2 gap-4 sm:flex-row sm:gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-32 sm:w-40 mt-4 bg-white/30 backdrop-blur-sm text-black font-semibold 
               py-2.5 rounded-xl hover:bg-white/40 transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Logging in..." : "Login"}
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

export default Login;