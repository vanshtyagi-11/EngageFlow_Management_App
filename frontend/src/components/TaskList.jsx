import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckSquare2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";
import ManagerRequests from "./ManagerRequests";
import EngagementForm from "./EngagementForm";

const labels = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_CLIENT: "Waiting for Client",
  READY_FOR_REVIEW: "Ready for Review",
  CHANGES_REQUESTED: "Changes Requested",
  COMPLETED: "Completed",
};
const transitions = {
  NOT_STARTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_CLIENT", "READY_FOR_REVIEW"],
  WAITING_FOR_CLIENT: ["IN_PROGRESS"],
  READY_FOR_REVIEW: ["COMPLETED", "CHANGES_REQUESTED"],
  CHANGES_REQUESTED: ["IN_PROGRESS"],
  COMPLETED: [],
};

const TaskList = () => {
  const { api, user } = useAppContext();
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [showEngagementForm, setShowEngagementForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestRefresh, setRequestRefresh] = useState(0);
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/tasks");
      setTasks(data.tasks || []);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    if (["MANAGER", "ADMIN"].includes(user?.role)) {
      api
        .get("/api/admin/users")
        .then(({ data }) =>
          setTeam(
            (data.users || []).filter((member) => member.role === "TEAM_MEMBER")
          )
        )
        .catch((error) => toast.error(getApiError(error)));
    }
  }, [api, user?.role]);
  const visible = useMemo(
    () =>
      tasks.filter((task) =>
        [
          task.title,
          task.status,
          task.assignee?.username,
          task.engagement?.period,
        ].some((value) => value?.toLowerCase().includes(query.toLowerCase()))
      ),
    [tasks, query]
  );
  const updateStatus = async (task, status) => {
    try {
      await api.patch(`/api/tasks/${task._id}/status`, { status });
      toast.success("Task updated");
      window.dispatchEvent(new Event("tasks-updated"));
      load();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };
  const assignTask = async (task, assignee) => {
    try {
      await api.patch(`/api/tasks/${task._id}/assignee`, { assignee });
      toast.success("Task assigned");
      window.dispatchEvent(new Event("tasks-updated"));
      load();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };
  return (
    <main className="min-h-full bg-[#f7f9fb] p-4 sm:p-6">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-[#e3e8ed] bg-white shadow-sm">
        <header className="border-b border-[#edf0f3] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#20364f]">
                All tasks
              </h2>
              <p className="mt-1 text-xs text-[#91a0b2]">
                Update work and submit tasks for manager review.
              </p>
            </div>
            <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-[#e6ebef] bg-[#fafcfd] px-3 text-[#91a0b2] sm:w-64">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-transparent text-xs outline-none"
              />
            </label>
          </div>
        </header>
        {["MANAGER", "ADMIN"].includes(user?.role) && (
          <ManagerRequests
            key={requestRefresh}
            embedded
            onCreateEngagement={(request) => {
              setSelectedRequest(request);
              setShowEngagementForm(true);
            }}
          />
        )}
        {loading ? (
          <div className="p-12 text-center text-sm text-[#91a0b2]">
            Loading...
          </div>
        ) : (
          <div className="divide-y divide-[#edf0f3]">
            {visible.length ? (
              visible.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <CheckSquare2
                      className="mt-0.5 shrink-0 text-[#6488a6]"
                      size={18}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#20364f]">
                        {task.title}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8b9aab]">
                        {task.assignee?.username || "Unassigned"} · Due{" "}
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {team.length > 0 && (
                      <select
                        value={task.assignee?._id || ""}
                        onChange={(event) =>
                          assignTask(task, event.target.value)
                        }
                        className="h-7 rounded-lg border border-[#dfe6ed] px-2 text-[10px] font-semibold text-[#49647e]"
                        aria-label={`Assign ${task.title}`}
                      >
                        <option value="">Unassigned</option>
                        {team.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.name || member.username}
                          </option>
                        ))}
                      </select>
                    )}
                    <span className="rounded-md bg-[#edf3f7] px-2.5 py-1 text-[10px] font-semibold text-[#42647f]">
                      {labels[task.status]}
                    </span>
                    {transitions[task.status].map((nextStatus) => (
                      <button
                        key={nextStatus}
                        onClick={() => updateStatus(task, nextStatus)}
                        disabled={
                          nextStatus === "COMPLETED" &&
                          !["ADMIN", "MANAGER"].includes(user?.role)
                        }
                        className="rounded-lg border border-[#dfe6ed] px-2.5 py-1.5 text-[10px] font-semibold text-[#49647e] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {labels[nextStatus]}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-sm text-[#91a0b2]">
                No tasks found.
              </div>
            )}
          </div>
        )}
      </section>
      {showEngagementForm && (
        <EngagementForm
          request={selectedRequest}
          onClose={() => setShowEngagementForm(false)}
          onCreated={() => {
            setShowEngagementForm(false);
            setSelectedRequest(null);
            setRequestRefresh((value) => value + 1);
            load();
          }}
        />
      )}
    </main>
  );
};
export default TaskList;
