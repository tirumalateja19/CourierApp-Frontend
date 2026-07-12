// src/components/LogoutButton.jsx
import { useAuth } from "../context/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
