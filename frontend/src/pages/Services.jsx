import { useState } from "react";
import ResourcePage from "../components/ResourcePage";
import ServiceForm from "../components/ServiceForm";
import { useAppContext } from "../contexts/AppContext";

const Services = () => {
  const { user, api } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(0);
  if (!["MANAGER", "ADMIN"].includes(user?.role))
    return (
      <main className="min-h-full bg-[#f7f9fb] p-8 text-sm text-[#66717e]">
        Only managers can manage service types.
      </main>
    );
  return (
    <>
      <ResourcePage
        key={reload}
        title="Service Types"
        subtitle="Manage services used to create engagements."
        endpoint="/api/services"
        keyName="services"
        actionLabel="Add Service"
        onAction={() => setShowForm(true)}
        onDelete={(service) => api.delete(`/api/services/${service._id}`)}
        columns={[
          { label: "Service", key: "name" },
          { label: "Recurrence", key: "recurrence" },
          { label: "Description", key: "description" },
          {
            label: "Status",
            render: (item) => (item.isActive ? "Active" : "Inactive"),
          },
        ]}
      />
      {showForm && (
        <ServiceForm
          onClose={() => setShowForm(false)}
          onCreated={() => setReload((value) => value + 1)}
        />
      )}
    </>
  );
};
export default Services;
