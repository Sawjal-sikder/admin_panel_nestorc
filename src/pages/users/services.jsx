import React, { useState } from "react";
import { Table } from "antd";
import servicedataHook from "./serviceeHook/servicedataHook";
import TableColumn from "./serviceeHook/TableColumn/servicecolumn";
import DetailsModal from "./serviceDetails";

const MainComponent = () => {
  const { data, loading, error } = servicedataHook();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [blockLoading, setBlockLoading] = useState(false);

  const handleUserDetails = (record) => {
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id) => {
    setBlockLoading(true);
    // call API or handle toggle logic
    setTimeout(() => setBlockLoading(false), 1000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Table
        columns={TableColumn({ handleUserDetails, blockLoading, handleToggleActive })}
        dataSource={data}
        rowKey="id"
      />
      <DetailsModal
        visible={isModalOpen}
        data={selectedData}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default MainComponent;
