import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";

const ServiceForm = ({ onClose, onCreated }) => {
  const { api } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    description: "",
    recurrence: "ONE_TIME",
  });
  const [taskTitles, setTaskTitles] = useState(["Collect information"]);
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/services", form);
      try {
        await Promise.all(
          taskTitles
            .map((title) => title.trim())
            .filter(Boolean)
            .map((title, sequence) =>
              api.post(`/api/services/${data.service._id}/templates`, {
                title,
                sequence,
                defaultDueDays: 7,
              })
            )
        );
      } catch (templateError) {
        toast.error(
          `Service created, but task templates could not be added: ${getApiError(
            templateError
          )}`
        );
      }
      toast.success("Service type created");
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
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Add Service Type
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              This service will become available in engagement forms.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <label className="block text-xs font-semibold text-slate-600">
          Name
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
          />
        </label>
        <label className="mt-4 block text-xs font-semibold text-slate-600">
          Description
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500"
            rows="3"
          />
        </label>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">
              Task templates
            </label>
            <button
              type="button"
              onClick={() => setTaskTitles((current) => [...current, ""])}
              className="text-[10px] font-semibold text-[#49647e]"
            >
              + Add task
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {taskTitles.map((title, index) => (
              <input
                key={index}
                required={index === 0}
                value={title}
                placeholder={`Task ${index + 1} title`}
                onChange={(event) =>
                  setTaskTitles((current) =>
                    current.map((value, itemIndex) =>
                      itemIndex === index ? event.target.value : value
                    )
                  )
                }
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-normal outline-none focus:border-indigo-500"
              />
            ))}
          </div>
        </div>
        <label className="mt-4 block text-xs font-semibold text-slate-600">
          Recurrence
          <select
            value={form.recurrence}
            onChange={(event) =>
              setForm({ ...form, recurrence: event.target.value })
            }
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal"
          >
            <option value="ONE_TIME">One-time</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </label>
        <div className="mt-5 flex justify-end gap-2">
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
            {loading ? "Saving..." : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ServiceForm;
