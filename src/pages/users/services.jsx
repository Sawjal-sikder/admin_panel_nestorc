import React, { useState } from "react";
import { Table, Modal } from "antd";
import servicedataHook from "./serviceeHook/servicedataHook";
import TableColumn from "./serviceeHook/TableColumn/servicecolumn";
import DetailsModal from "./serviceDetails";
import CreateVenue from "./serviceeHook/createVenue";

const MainComponent = () => {
  const { data, loading, error } = servicedataHook();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCreateVenue, setIsModalOpenCreateVenue] = useState(false);
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

  const handleCreate = () => {
    setIsModalOpenCreateVenue(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white border-none px-4 py-2 rounded cursor-pointer font-medium shadow"
        >
          Create Venue
        </button>
      </div>

      <Table
        columns={TableColumn({ handleUserDetails, blockLoading, handleToggleActive })}
        dataSource={data}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* Details Modal */}
      <DetailsModal
        visible={isModalOpen}
        data={selectedData}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Create Venue Modal */}
      <Modal
        title="Create Venue"
        open={isModalOpenCreateVenue}
        onCancel={() => setIsModalOpenCreateVenue(false)}
        footer={null} // no default footer
      >
        <CreateVenue />
      </Modal>
    </>
  );
};

export default MainComponent;
