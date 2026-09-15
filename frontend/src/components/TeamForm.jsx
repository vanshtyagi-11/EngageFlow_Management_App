import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";

const TeamForm = ({ onClose, onCreated }) => {
  const { api } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    role: "TEAM_MEMBER",
    designation: "",
  });
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/admin/users", form);
      toast.success("Team member added");
      onCreated();
      onClose();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Add Team Member
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Create a manager or team member account.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Full name"],
            ["username", "Username"],
            ["email", "Email"],
            ["password", "Temporary password"],
          ].map(([name, label]) => (
            <label key={name} className="text-xs font-semibold text-slate-600">
              {label}
              <input
                required
                name={name}
                type={
                  name === "email"
                    ? "email"
                    : name === "password"
                    ? "password"
                    : "text"
                }
                value={form[name]}
                onChange={update}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
              />
            </label>
          ))}
          <label className="text-xs font-semibold text-slate-600">
            Role
            <select
              name="role"
              value={form.role}
              onChange={update}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal"
            >
              <option value="TEAM_MEMBER">Team Member</option>
              <option value="MANAGER">Manager</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Designation
            <input
              name="designation"
              value={form.designation}
              onChange={update}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="rounded-xl bg-[#223650] px-4 py-3 text-xs font-semibold text-white"
          >
            {loading ? "Saving..." : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default TeamForm;
