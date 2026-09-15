import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";

const ClientForm = ({ onClose, onCreated }) => {
  const { api } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/clients", form);
      toast.success("Client added");
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
            <h2 className="text-xl font-bold text-slate-800">Add Client</h2>
            <p className="mt-1 text-xs text-slate-400">
              Create a client for future engagements.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Client name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["address", "Address", "text"],
          ].map(([name, label, type]) => (
            <label key={name} className="text-xs font-semibold text-slate-600">
              {label}
              <input
                required={name === "name"}
                name={name}
                type={type}
                value={form[name]}
                onChange={update}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
              />
            </label>
          ))}
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
            {loading ? "Saving..." : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ClientForm;
