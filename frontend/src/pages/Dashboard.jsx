import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckSquare2,
  CircleAlert,
  Clock3,
  FileCheck2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";
import ManagerRequests from "../components/ManagerRequests";

const metrics = [
  ["Open tasks", "open", CheckSquare2],
  ["Overdue", "overdue", CircleAlert],
  ["Due today", "dueToday", CalendarDays],
  ["Waiting for client", "waitingClient", Clock3],
  ["Waiting for review", "waitingReview", FileCheck2],
];
const labels = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_CLIENT: "Waiting for Client",
  READY_FOR_REVIEW: "Ready for Review",
  CHANGES_REQUESTED: "Changes Requested",
  COMPLETED: "Completed",
};

const Dashboard = () => {
  const { api, user } = useAppContext();
  const [summary, setSummary] = useState({});
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    Promise.all([api.get("/api/dashboard/summary"), api.get("/api/tasks")])
      .then(([summaryResponse, taskResponse]) => {
        setSummary(summaryResponse.data.metrics || {});
        setTasks((taskResponse.data.tasks || []).slice(0, 5));
      })
      .catch((error) => toast.error(getApiError(error)));
  }, [api, reload]);
  return (
    <main className="min-h-full bg-[#f7f9fb] px-4 py-7 text-[#1d2e43] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-360">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[25px] font-semibold text-[#172b44]">
              Dashboard
            </h1>
            <p className="mt-1 text-xs text-[#8b9aab]">
              Here&apos;s what needs your attention today.
            </p>
          </div>
        </header>
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {metrics.map(([label, key, Icon]) => (
            <article
              key={key}
              className="min-h-31 rounded-lg border border-[#e3e8ed] bg-white p-4"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#edf3f7] text-[#4d6b86]">
                <Icon size={17} />
              </span>
              <p className="mt-4 text-[23px] font-semibold leading-none text-[#172b44]">
                {summary[key] ?? "-"}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#213750]">
                {label}
              </p>
            </article>
          ))}
        </section>
        {["MANAGER", "ADMIN"].includes(user?.role) && (
          <ManagerRequests key={reload} />
        )}
        <section className="mt-4 overflow-hidden rounded-lg border border-[#e3e8ed] bg-white">
          <div className="border-b border-[#edf0f3] px-5 py-4">
            <h2 className="text-[13px] font-semibold text-[#20364f]">
              Tasks needing attention
            </h2>
            <p className="mt-1 text-[10px] text-[#91a0b2]">
              Live tasks from your workspace
            </p>
          </div>
          {tasks.length ? (
            <div className="divide-y divide-[#edf0f3]">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between gap-3 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CheckSquare2
                      size={18}
                      className="shrink-0 text-[#6488a6]"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#20364f]">
                        {task.title}
                      </p>
                      <p className="mt-1 text-[10px] text-[#8b9aab]">
                        {task.assignee?.username || "Unassigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-[10px] text-[#768799]">
                    <span className="hidden sm:inline">
                      <CalendarDays className="mr-1 inline" size={13} />
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                    <span className="rounded-md bg-[#edf3f7] px-2 py-1 font-medium text-[#42647f]">
                      {labels[task.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-[#91a0b2]">
              No tasks available.
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
export default Dashboard;
