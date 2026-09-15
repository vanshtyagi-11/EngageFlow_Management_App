import {
  BriefcaseBusiness,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  MoreHorizontal,
  Settings,
  ShieldCheck,
  UserCircle2,
  UserGroup,
  UsersRound,
  FilePlus2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useEffect, useState } from "react";

const NavItem = ({ item, livePath }) => (
  <Link
    to={item.path}
    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      livePath == item.path
        ? "bg-[#e9f0f7] font-semibold text-[#1d3a60]"
        : "text-[#52647a] hover:bg-[#f1f5f8] hover:text-[#1d3a60]"
    }`}
  >
    <item.icon className="h-4.5 w-4.5 shrink-0" />
    <span className="flex-1">{item.label}</span>
    {item.count !== undefined && (
      <span className="rounded-full bg-[#e5ebf2] px-2 py-0.5 text-[10px] font-semibold text-[#63748a]">
        {item.count}
      </span>
    )}
  </Link>
);

const Sidebar = () => {
  const livePath = useLocation().pathname;
  const { user, api } = useAppContext();
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    if (user?.role === "CLIENT") return;
    const loadTaskCount = () => {
      api
        .get("/api/tasks")
        .then(({ data }) => setTaskCount(data.tasks?.length || 0))
        .catch(() => setTaskCount(0));
    };
    loadTaskCount();
    window.addEventListener("tasks-updated", loadTaskCount);
    return () => window.removeEventListener("tasks-updated", loadTaskCount);
  }, [api, user?.role]);
  const displayName = user?.name || user?.username || "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const roleLabel =
    user?.role === "TEAM_MEMBER"
      ? "Team Member"
      : user?.role === "CLIENT"
      ? "Client"
      : "Manager";
  const navigation =
    user?.role === "CLIENT"
      ? [
          { label: "My Portal", icon: LayoutDashboard, path: "/client-portal" },
          {
            label: "Request Work",
            icon: FilePlus2,
            path: "/client-portal/request-work",
          },
        ]
      : [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/",
          },
          {
            label: "Engagements",
            icon: ClipboardList,
            path: "/engagements",
          },
          {
            label: "All Tasks",
            count: taskCount,
            icon: ListChecks,
            path: "/tasks",
          },
          {
            label: "Clients",
            icon: UserGroup,
            path: "/clients",
          },
          {
            label: "Team",
            icon: UsersRound,
            path: "/team",
          },
          {
            label: "Services",
            icon: BriefcaseBusiness,
            path: "/services",
          },
        ];
  const adminNavigation =
    user?.role === "CLIENT"
      ? []
      : [
          {
            label: "Permissions",
            icon: ShieldCheck,
            path: "/permissions",
          },
          {
            label: "Settings",
            icon: Settings,
            path: "/settings",
          },
        ];
  return (
    <div className="hidden h-screen min-h-0 w-55.5 shrink-0 overflow-hidden border-r border-[#e3e8ee] bg-white lg:flex lg:flex-col">
      <div className="flex h-15.5 items-center gap-3 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dee1e5] text-white">
          <BriefcaseBusiness size={17} />
        </div>
        <div>
          <p className="text-[15px] font-bold leading-4 text-[#172b44]">
            EngageFlow
          </p>
          <p className="mt-1 text-[10px] text-[#91a0b2]">Work management</p>
        </div>
      </div>
      <div className="px-3 pt-2.5">
        <div className="flex w-full items-center gap-3 rounded-xl border border-[#e9edf1] bg-[#fafcfd] px-3 py-2.5 text-left">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#edf3f8] text-[#456681]">
            <BriefcaseBusiness size={15} />
          </span>
          <span className="flex-1">
            <span className="block text-[9px] text-[#91a0b2]">Workspace</span>
            <span className="block text-[11px] font-semibold text-[#1c324f]">
              Professional Services
            </span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#8291a2]" />
        </div>
      </div>
      <nav className="flex-none px-3 pt-5">
        <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa8b8]">
          Main menu
        </p>
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.label} item={item} livePath={livePath} />
          ))}
        </div>
      </nav>
      <div className="flex-none">
        <p className="px-2 pb-2 pt-4 text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa8b8]">
          Administration
        </p>
        <div className="space-y-1">
          {adminNavigation.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </div>
      </div>
      <div className="mt-auto flex items-center gap-3 border-t border-[#edf0f3] px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2f7] text-[#49647e]">
          {initials || <UserCircle2 size={17} />}
        </div>
        <div className="flex-1">
          <p className="truncate text-[11px] font-semibold">{displayName}</p>
          <p className="text-[9px] text-[#91a0b2]">{roleLabel}</p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-[#31445a]" />
      </div>
    </div>
  );
};

export default Sidebar;
