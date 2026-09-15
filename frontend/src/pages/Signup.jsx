import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link aur useNavigate import karein
import {
  BriefcaseBusiness,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  UserRoundPlus,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";
import toast from "react-hot-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const { api } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await api.post("/api/users/signup", Object.fromEntries(form.entries()));
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-2 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

  const labelClass =
    "mb-1 block text-xs font-semibold text-slate-600 sm:text-sm";

  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 px-4 py-2 sm:overflow-hidden sm:py-2">
      <div className="mx-auto flex min-h-full w-full max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-4">
          <div className="mb-3 flex justify-center sm:mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-900">
                <BriefcaseBusiness
                  size={22}
                  strokeWidth={2}
                  className="text-white"
                />
              </div>
              <div>
                <h1 className="text-[25px] font-bold leading-none tracking-tight text-slate-900">
                  EngageFlow
                </h1>
                <p className="mt-1 text-[10px] font-medium leading-none text-slate-400">
                  Work management
                </p>
              </div>
            </div>
          </div>

          <div className="mb-2 text-center sm:mb-2">
            <h2 className="text-2xl font-bold text-slate-800">
              Create your account
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Get started with EngageFlow today
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              {/* USERNAME */}
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username
                </label>
                <div className="relative">
                  <User
                    size={18}
                    strokeWidth={1.8}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    autoComplete="username"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* USER TYPE */}
              <div>
                <label htmlFor="userType" className={labelClass}>
                  User Type
                </label>
                <div className="relative">
                  <select
                    id="userType"
                    name="userType"
                    defaultValue=""
                    required
                    className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="" disabled>
                      Select user type
                    </option>
                    <option value="client">Client</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    strokeWidth={1.8}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    strokeWidth={1.8}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={`${inputClass} password-input pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label htmlFor="rePassword" className={labelClass}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    strokeWidth={1.8}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="rePassword"
                    name="rePassword"
                    type={showRePassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={`${inputClass} password-input pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
              >
                <UserRoundPlus size={18} strokeWidth={2} />
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <div className="mt-3 border-t border-slate-100 pt-2 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-900 transition hover:text-indigo-700"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-slate-400">
            By creating an account, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
