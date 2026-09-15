import { useState } from "react";
import ResourcePage from "../components/ResourcePage";
import TeamForm from "../components/TeamForm";
import { useAppContext } from "../contexts/AppContext";

const Team = () => {
  const { user } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(0);
  const canManage = ["MANAGER", "ADMIN"].includes(user?.role);
  if (!canManage)
    return (
      <main className="min-h-full bg-[#f7f9fb] p-8 text-sm text-[#66717e]">
        Only managers can manage team accounts.
      </main>
    );

  return (
    <>
      <ResourcePage
        key={reload}
        title="Team"
        subtitle="Manage managers and team members."
        endpoint="/api/admin/users"
        keyName="users"
        actionLabel="Add Member"
        onAction={canManage ? () => setShowForm(true) : undefined}
        columns={[
          { label: "Name", render: (item) => item.name || item.username },
          { label: "Email", key: "email" },
          { label: "Role", key: "role" },
          {
            label: "Status",
            render: (item) => (item.isActive ? "Active" : "Inactive"),
          },
        ]}
      />
      {showForm && (
        <TeamForm
          onClose={() => setShowForm(false)}
          onCreated={() => setReload((value) => value + 1)}
        />
      )}
    </>
  );
};

export default Team;
