import { useState } from "react";
import ResourcePage from "../components/ResourcePage";
import ClientForm from "../components/ClientForm";
import { useAppContext } from "../contexts/AppContext";

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(0);
  const { user } = useAppContext();

  return (
    <>
      <ResourcePage
        key={reload}
        title="Clients"
        subtitle="Manage clients and their active services."
        endpoint="/api/clients"
        keyName="clients"
        actionLabel="Add Client"
        onAction={
          ["ADMIN", "MANAGER"].includes(user?.role)
            ? () => setShowForm(true)
            : undefined
        }
        columns={[
          { label: "Client", key: "name" },
          { label: "Email", key: "email" },
          { label: "Phone", key: "phone" },
          {
            label: "Created",
            render: (item) => new Date(item.createdAt).toLocaleDateString(),
          },
        ]}
      />
      {showForm && (
        <ClientForm
          onClose={() => setShowForm(false)}
          onCreated={() => setReload((value) => value + 1)}
        />
      )}
    </>
  );
};

export default Clients;
