import { useEffect, useState } from "react";
import { Clock3, FilePlus2, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";

const statusLabel = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_CLIENT: "Waiting for Client",
  READY_FOR_REVIEW: "Ready for Review",
  CHANGES_REQUESTED: "Changes Requested",
  COMPLETED: "Completed",
};
const requestLabel = {
  REQUESTED: "Requested",
  IN_REVIEW: "In Review",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

const ClientPortal = ({ initialRequestOpen = false }) => {
  const { api, user } = useAppContext();
  const [data, setData] = useState({ engagements: [], tasks: [], progress: 0 });
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(initialRequestOpen);
  const [form, setForm] = useState({
    serviceType: "",
    requestedDeadline: "",
    description: "",
  });
  const load = async () => {
    try {
      const [summary, requestList, serviceList] = await Promise.all([
        api.get("/api/client-portal/summary"),
        api.get("/api/client-portal/requests"),
        api.get("/api/services"),
      ]);
      setData(summary.data);
      setRequests(requestList.data.requests || []);
      setServices(serviceList.data.services || []);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };
  useEffect(() => {
    load();
  }, []);
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/api/client-portal/requests", form);
      toast.success("Work request sent");
      setForm({ serviceType: "", requestedDeadline: "", description: "" });
      setShowForm(false);
      load();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };
  return (
    <main className="min-h-full bg-[#f7f9fb] px-4 py-7 text-[#1d2e43] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-360">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[25px] font-semibold text-[#172b44]">
              Welcome, {user?.name || user?.username}
            </h1>
            <p className="mt-1 text-xs text-[#8b9aab]">
              Share new work and track your existing work in one place.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#223650] px-4 text-xs font-semibold text-white"
          >
            <FilePlus2 size={16} />
            Request Work
          </button>
        </header>
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#e3e8ed] bg-white p-5">
            <p className="text-xs text-[#8b9aab]">Overall progress</p>
            <p className="mt-3 text-3xl font-semibold text-[#172b44]">
              {data.progress}%
            </p>
            <div className="mt-3 h-2 rounded-full bg-[#edf0f3]">
              <div
                className="h-2 rounded-full bg-[#47796b]"
                style={{ width: `${data.progress}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg border border-[#e3e8ed] bg-white p-5">
            <p className="text-xs text-[#8b9aab]">Engagements</p>
            <p className="mt-3 text-3xl font-semibold text-[#172b44]">
              {data.engagements.length}
            </p>
          </div>
          <div className="rounded-lg border border-[#e3e8ed] bg-white p-5">
            <p className="text-xs text-[#8b9aab]">Open tasks</p>
            <p className="mt-3 text-3xl font-semibold text-[#172b44]">
              {data.tasks.filter((task) => task.status !== "COMPLETED").length}
            </p>
          </div>
        </section>
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-[#e3e8ed] bg-white">
            <div className="border-b border-[#edf0f3] px-5 py-4">
              <h2 className="text-sm font-semibold text-[#20364f]">
                Your work
              </h2>
            </div>
            {data.tasks.length ? (
              <div className="divide-y divide-[#edf0f3]">
                {data.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <Clock3 size={17} className="text-[#6488a6]" />
                      <div>
                        <p className="text-xs font-semibold text-[#20364f]">
                          {task.title}
                        </p>
                        <p className="mt-1 text-[10px] text-[#8b9aab]">
                          Due {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-md bg-[#edf3f7] px-2 py-1 text-[10px] font-medium text-[#42647f]">
                      {statusLabel[task.status]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-xs text-[#91a0b2]">
                No work has been created yet.
              </p>
            )}
          </div>
          <div className="overflow-hidden rounded-lg border border-[#e3e8ed] bg-white">
            <div className="border-b border-[#edf0f3] px-5 py-4">
              <h2 className="text-sm font-semibold text-[#20364f]">
                Work requests
              </h2>
            </div>
            {requests.length ? (
              <div className="divide-y divide-[#edf0f3]">
                {requests.map((request) => (
                  <div key={request._id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#20364f]">
                        {request.serviceType?.name || request.title}
                      </p>
                      <span className="text-[10px] text-[#846f46]">
                        {requestLabel[request.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-medium text-[#49647e]">
                      {request.serviceType?.name || "Service type unavailable"}
                    </p>
                    <p className="mt-1 text-[10px] text-[#8b9aab]">
                      Complete by{" "}
                      {request.requestedDeadline
                        ? new Date(
                            request.requestedDeadline
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                    <p className="mt-1 text-[11px] text-[#8b9aab]">
                      {request.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-xs text-[#91a0b2]">
                No requests yet.
              </p>
            )}
          </div>
        </section>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <form
            onSubmit={submit}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Request Work
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Tell the team what you need help with.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>
            <label className="block text-xs font-semibold text-slate-600">
              Service type
              <select
                required
                value={form.serviceType}
                onChange={(event) =>
                  setForm({ ...form, serviceType: event.target.value })
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
              >
                <option value="">
                  {services.length
                    ? "Select service type"
                    : "Loading services..."}
                </option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-xs font-semibold text-slate-600">
              Completion deadline
              <input
                required
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.requestedDeadline}
                onChange={(event) =>
                  setForm({ ...form, requestedDeadline: event.target.value })
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
              />
            </label>
            <label className="mt-4 block text-xs font-semibold text-slate-600">
              Description
              <textarea
                required
                rows="5"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500"
              />
            </label>
            <div className="mt-5 flex justify-end">
              <button className="flex items-center gap-2 rounded-xl bg-[#223650] px-4 py-3 text-xs font-semibold text-white">
                <Send size={15} />
                Send Request
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
export default ClientPortal;
