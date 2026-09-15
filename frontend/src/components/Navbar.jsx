import { Bell, Menu, Search, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";

const Navbar = () => {
  const { user, logout } = useAppContext();
  const roleLabel =
    user?.role === "TEAM_MEMBER"
      ? "Team Member"
      : user?.role === "CLIENT"
      ? "Client"
      : "Manager";
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex bg-[#f7f9fb] text-[#182b43]">
      <header className="fixed left-0 right-0 top-0 z-10 flex h-15.5 items-center border-b border-[#e3e8ee] bg-white px-5 lg:left-55.5 lg:px-7">
        <div className="flex w-full items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#50647b] transition-colors hover:bg-[#f1f5f8] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Search Input Box */}
          <div className="flex h-9 max-w-113.75 flex-1 items-center gap-3 rounded-lg border border-[#e8edf2] bg-[#fafbfc] px-3 text-[#8d9aaa]">
            <Search className="h-4 w-4 shrink-0 text-[#8d9aaa]" />
            <input
              type="text"
              placeholder="Search tasks, clients, engagements..."
              className="w-full bg-transparent text-xs text-[#182b43] outline-none placeholder:text-[#8d9aaa]"
            />
            <kbd className="ml-auto hidden rounded border border-[#e1e6ec] bg-white px-1.5 py-0.5 text-[10px] text-[#9aa7b5] sm:inline">
              ⌘ K
            </kbd>
          </div>

          {/* Right Action Options */}
          <div className="ml-auto flex items-center gap-4 text-xs">
            <span className="hidden text-[#8f9bab] sm:inline">{roleLabel}</span>

            {/* Notifications Button */}
            <button
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#607389] transition-colors hover:bg-[#f1f5f8]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c65e51]" />
            </button>

            {/* Profile & Logout Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2f7] text-[#49647e] transition-colors hover:bg-[#e2e8f0]"
                aria-label="User Profile"
              >
                <User className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-[#e8edf2] bg-white p-1.5 shadow-lg">
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
