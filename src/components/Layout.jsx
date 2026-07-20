import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  PlusCircle,
  UserPlus,
  Users,
  KeyRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Jobs", icon: LayoutDashboard },
  { to: "/admin/jobs/create-job", label: "Create Job", icon: PlusCircle },
  { to: "/admin/partners", label: "Partners", icon: Users },
  { to: "/admin/jobs/create-partner", label: "Create Partner", icon: UserPlus },
];

const PARTNER_LINKS = [
  { to: "/partner/dashboard", label: "My Jobs", icon: LayoutDashboard },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = user?.role === "admin" ? ADMIN_LINKS : PARTNER_LINKS;

  const currentLink = links.find((link) =>
    location.pathname.startsWith(link.to),
  );
  const pageTitle = currentLink?.label || "PickItUp";

  return (
    <div className="min-h-screen flex bg-white">
      <aside
        className={`bg-gray-50 border-r border-gray-200 flex flex-col justify-between transition-all ${
          sidebarOpen ? "w-56" : "w-16"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 px-4 py-5">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-1 rounded-lg hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <LayoutDashboard className="size-5" />
            </button>
            {sidebarOpen && (
              <span className="font-semibold text-black">PickItUp</span>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium transition ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  {sidebarOpen && <span>{link.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 px-3 py-4 flex flex-col gap-1">
          {sidebarOpen && (
            <div className="px-3 pb-2 text-sm text-gray-500 truncate capitalize">
              {user?.userName}
            </div>
          )}
          <NavLink
            to="/auth/change-password"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <KeyRound className="size-4 shrink-0" />
            {sidebarOpen && <span>Change password</span>}
          </NavLink>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="size-4 shrink-0" />
            {sidebarOpen && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-lg font-semibold text-black">{pageTitle}</h1>
        </div>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
