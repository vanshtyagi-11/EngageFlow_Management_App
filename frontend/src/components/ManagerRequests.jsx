import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";

const ManagerRequests = ({
  onCreateEngagement,
  onChanged,
  embedded = false,
}) => {
  const { api } = useAppContext();
  const [requests, setRequests] = useState([]);
  const load = async () => {
    try {
      const { data } = await api.get("/api/client-portal/manager/requests");
      setRequests(data.requests || []);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };
  useEffect(() => {
    load();
  }, []);
  const update = async (id, status) => {
    try {
      await api.patch(`/api/client-portal/manager/requests/${id}`, { status });
      toast.success("Request updated");
      load();
      onChanged?.();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };
  return (
    <div
      className={
        embedded
          ? "divide-y divide-[#edf0f3]"
          : "mt-4 overflow-hidden rounded-lg border border-[#e3e8ed] bg-white"
      }
    >
      {!embedded && (
        <div className="border-b border-[#edf0f3] px-5 py-4">
          <h2 className="text-[13px] font-semibold text-[#20364f]">
            Client work requests
          </h2>
          <p className="mt-1 text-[10px] text-[#91a0b2]">
            Approve requests and create the related engagement.
          </p>
        </div>
      )}
      {requests.length ? (
        <div className="divide-y divide-[#edf0f3]">
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-[#20364f]">
                  {request.title}
                </p>
                <p className="mt-1 text-[10px] text-[#8b9aab]">
                  {request.client?.name || request.requestedBy?.username} ·{" "}
                  {request.serviceType?.name || "Service type unavailable"} ·{" "}
                  Complete by{" "}
                  {request.requestedDeadline
                    ? new Date(request.requestedDeadline).toLocaleDateString()
                    : "Not specified"}{" "}
                  · {request.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.status === "REQUESTED" && (
                  <button
                    onClick={() => update(request._id, "ACCEPTED")}
                    className="rounded-lg bg-[#47796b] px-2.5 py-1.5 text-[10px] font-semibold text-white"
                  >
                    Approve Request
                  </button>
                )}
                {request.status === "REQUESTED" && (
                  <button
                    onClick={() => update(request._id, "REJECTED")}
                    className="rounded-lg border border-[#dfe6ed] px-2.5 py-1.5 text-[10px] font-semibold text-[#a65d5b]"
                  >
                    Reject
                  </button>
                )}
                {request.status === "ACCEPTED" &&
                  !request.engagement &&
                  onCreateEngagement && (
                    <button
                      onClick={() => onCreateEngagement(request)}
                      className="rounded-lg bg-[#223650] px-2.5 py-1.5 text-[10px] font-semibold text-white"
                    >
                      Create Engagement
                    </button>
                  )}
                {request.engagement && (
                  <span className="rounded-lg bg-[#edf3f7] px-2.5 py-1.5 text-[10px] font-semibold text-[#47796b]">
                    Engagement created
                  </span>
                )}
                {request.status !== "REQUESTED" &&
                  request.status !== "ACCEPTED" && (
                    <span className="rounded-lg bg-[#f7f8f9] px-2.5 py-1.5 text-[10px] font-semibold text-[#66717e]">
                      {request.status.replace("_", " ")}
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : embedded ? null : (
        <p className="p-8 text-center text-xs text-[#91a0b2]">
          No client requests.
        </p>
      )}
    </div>
  );
};
export default ManagerRequests;
