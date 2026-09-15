import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";

const EngagementForm = ({ onClose, onCreated, request }) => {
  const { api } = useAppContext();
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client: request?.client?._id || "",
    serviceType: request?.serviceType?._id || "",
    type: "RECURRING",
    period: "",
    startDate: "",
    deadline: request?.requestedDeadline
      ? request.requestedDeadline.slice(0, 10)
      : "",
  });

  useEffect(() => {
    if (request?.client?._id) {
      setForm((current) => ({
        ...current,
        client: request.client._id,
        serviceType: request.serviceType?._id || current.serviceType,
        deadline: request.requestedDeadline
          ? request.requestedDeadline.slice(0, 10)
          : current.deadline,
      }));
    }
  }, [request]);

  useEffect(() => {
    Promise.all([api.get("/api/clients"), api.get("/api/services")])
      .then(([clientResponse, serviceResponse]) => {
        setClients(clientResponse.data.clients || []);
        setServices(serviceResponse.data.services || []);
      })
      .catch((error) => toast.error(getApiError(error)))
      .finally(() => setLoadingOptions(false));
  }, [api]);

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const updateService = (event) => {
    const service = services.find((item) => item._id === event.target.value);
    setForm((current) => ({
      ...current,
      serviceType: event.target.value,
      type: service?.recurrence === "ONE_TIME" ? "ONE_TIME" : "RECURRING",
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/engagements", {
        ...form,
        requestId: request?._id,
      });
      toast.success("Engagement created");
      window.dispatchEvent(new Event("tasks-updated"));
      onCreated();
      onClose();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const field =
    "h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Create Engagement
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Tasks will be generated from the selected service templates.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600">
            Client
            <select
              required
              name="client"
              value={form.client}
              onChange={update}
              disabled={Boolean(request)}
              className={`${field} mt-2`}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Service type
            <select
              required
              name="serviceType"
              value={form.serviceType}
              onChange={updateService}
              disabled={Boolean(request)}
              className={`${field} mt-2`}
            >
              <option value="">
                {loadingOptions ? "Loading services..." : "Select service type"}
              </option>
              {!loadingOptions && !services.length && (
                <option value="" disabled>
                  No service types available
                </option>
              )}
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} ({service.recurrence.replace("_", " ")})
                </option>
              ))}
            </select>
            {!loadingOptions && !services.length && (
              <span className="mt-1 block text-[10px] font-normal text-[#a65d5b]">
                Create a service type from the Services page first.
              </span>
            )}
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Engagement type
            <select
              name="type"
              value={form.type}
              onChange={update}
              disabled={!form.serviceType}
              className={`${field} mt-2`}
            >
              <option value="RECURRING">Recurring</option>
              <option value="ONE_TIME">One-time</option>
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Period
            <input
              required
              name="period"
              type="month"
              value={form.period}
              onChange={update}
              className={`${field} mt-2`}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Start date
            <div className="relative mt-2">
              <input
                required
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={update}
                className={field}
              />
              <CalendarDays
                size={16}
                className="pointer-events-none absolute right-3 top-3 text-slate-400"
              />
            </div>
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Deadline
            <div className="relative mt-2">
              <input
                required
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={update}
                disabled={Boolean(request)}
                className={field}
              />
              <CalendarDays
                size={16}
                className="pointer-events-none absolute right-3 top-3 text-slate-400"
              />
            </div>
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
            disabled={loading || !clients.length || !services.length}
            className="rounded-xl bg-[#223650] px-4 py-3 text-xs font-semibold text-white"
          >
            {loading ? "Creating..." : "Create Engagement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EngagementForm;
