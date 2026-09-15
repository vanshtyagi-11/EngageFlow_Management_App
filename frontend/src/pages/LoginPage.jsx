import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link aur useNavigate import karein
import {
  BriefcaseBusiness,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";
import toast from "react-hot-toast";

const Login = () => {
  const { api, login } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate initialize karein

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/login", {
        email: form.get("email"),
        password: form.get("password"),
      });
      login(data);
      toast.success("Welcome back");
      navigate(data.user.role === "CLIENT" ? "/client-portal" : "/");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-600";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        {/* ================= LOGO ================= */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-900">
              <BriefcaseBusiness
                size={28}
                strokeWidth={2}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-[25px] font-bold leading-none tracking-tight text-slate-900">
                EngageFlow
              </h1>
              <p className="mt-2 text-[10px] font-medium leading-none text-slate-400">
                Work management
              </p>
            </div>
          </div>
        </div>

        {/* ================= HEADING ================= */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Login to continue to your account
          </p>
        </div>

        {/* ================= LOGIN CARD ================= */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-600"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-900 transition hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-900 focus:ring-indigo-500"
              />

              <label
                htmlFor="remember"
                className="cursor-pointer text-sm text-slate-500"
              >
                Remember me
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
            >
              <LogIn size={18} strokeWidth={2} />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* SIGNUP LINK */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-900 transition hover:text-indigo-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-5 text-center text-xs text-slate-400">
          © 2026 EngageFlow. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Login;
