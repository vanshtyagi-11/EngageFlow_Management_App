import ResourcePage from "../components/ResourcePage";

const Engagements = () => {
  return (
    <>
      <ResourcePage
        title="Engagements"
        subtitle="Manage client engagements, periods and generated tasks."
        endpoint="/api/engagements"
        keyName="engagements"
        columns={[
          { label: "Client", render: (item) => item.client?.name },
          { label: "Service", render: (item) => item.serviceType?.name },
          { label: "Type", key: "type" },
          { label: "Period", key: "period" },
          { label: "Status", key: "status" },
        ]}
      />
    </>
  );
};

export default Engagements;
