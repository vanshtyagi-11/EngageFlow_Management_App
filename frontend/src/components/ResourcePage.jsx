import { useEffect, useState } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../contexts/AppContext";
import { getApiError } from "../lib/api";

const ResourcePage = ({
  title,
  subtitle,
  endpoint,
  keyName,
  columns,
  actionLabel,
  onAction,
  onDelete,
}) => {
  const { api } = useAppContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setItems(data[keyName] || []);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name || "this record"}?`)) return;
    try {
      await onDelete(item);
      await load();
      toast.success("Service type deleted");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-full bg-[#f7f9fb] px-4 py-7 text-[#1d2e43] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-360">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[25px] font-semibold text-[#172b44]">
              {title}
            </h1>
            <p className="mt-1 text-xs text-[#8b9aab]">{subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#dfe6ed] bg-white px-3 text-xs font-semibold text-[#49647e]"
              aria-label="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            {onAction && (
              <button
                onClick={onAction}
                className="flex h-10 items-center gap-2 rounded-xl bg-[#223650] px-4 text-xs font-semibold text-white"
              >
                <Plus size={16} />
                {actionLabel}
              </button>
            )}
          </div>
        </header>
        <section className="overflow-hidden rounded-xl border border-[#e3e8ed] bg-white">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#91a0b2]">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#91a0b2]">
              No records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-left text-xs">
                <thead className="border-b border-[#edf0f3] bg-[#fafcfd] text-[10px] uppercase tracking-wide text-[#8b9aab]">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.label}
                        className="px-5 py-3 font-semibold"
                      >
                        {column.label}
                      </th>
                    ))}
                    {onDelete && (
                      <th className="px-5 py-3" aria-label="Actions" />
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f3]">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-[#fafcfd]">
                      {columns.map((column) => (
                        <td
                          key={column.label}
                          className="px-5 py-4 text-[#52647a]"
                        >
                          {column.render
                            ? column.render(item)
                            : item[column.key] || "-"}
                        </td>
                      ))}
                      {onDelete && (
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => remove(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#a65d5b] hover:bg-[#fff2f1]"
                            aria-label={`Delete ${item.name || "record"}`}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ResourcePage;
