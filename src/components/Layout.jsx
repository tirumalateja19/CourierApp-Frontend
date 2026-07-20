import { useState } from "react";
import { Outlet, Link } from "react-router";
import {
  LayoutDashboard,
  PlusCircle,
  UserPlus,
  Users,
  Settings,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Jobs", icon: LayoutDashboard },
  { to: "/admin/jobs/create-job", label: "Create Job", icon: PlusCircle },
  { to: "/admin/partners", label: "Partners", icon: Users },
  // { to: "/admin/search", label: "Search", icon: Search },
  { to: "/admin/jobs/create-partner", label: "Create Partner", icon: UserPlus },
];

const PARTNER_LINKS = [
  { to: "/partner/dashboard", label: "My Jobs", icon: LayoutDashboard },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const links = user?.role === "admin" ? ADMIN_LINKS : PARTNER_LINKS;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>

          <div className="px-4 flex-1">
            <div className="aura aura-sm">
              <button className="btn">Courier App</button>
            </div>
          </div>

          <div className="dropdown dropdown-end relative">
            <button
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="btn btn-ghost flex items-center gap-2"
            >
              <span className="text-sm font-medium capitalize">
                {user?.userName}
              </span>
              <Settings className="size-4" />
            </button>

            {settingsOpen && (
              <ul className="menu dropdown-content bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow">
                <li>
                  <Link
                    to="/auth/change-password"
                    onClick={() => setSettingsOpen(false)}
                  >
                    <KeyRound className="size-4" />
                    Change Password
                  </Link>
                </li>
                <li>
                  <button onClick={logout}>
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* Whichever page matches the current route renders here */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right my-3"
                    data-tip={link.label}
                  >
                    <Icon className="size-4" />
                    <span className="is-drawer-close:hidden">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Layout;
