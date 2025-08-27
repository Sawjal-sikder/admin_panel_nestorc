import React, { useState, useEffect } from "react";
import { Table, Modal } from "antd";
import servicedataHook from "./serviceeHook/servicedataHook";
import TableColumn from "./serviceeHook/TableColumn/servicecolumn";
import DetailsModal from "./serviceDetails";
import CreateVenue from "./serviceeHook/createVenue";
import useDelete from "../../hook/delete";

const MainComponent = () => {
  const { data: initialData, loading, error } = servicedataHook();
  const { handleDelete, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDelete("/services/venues");

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCreateVenue, setIsModalOpenCreateVenue] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loadingItems, setLoadingItems] = useState(new Set());

  // Update local data when initial data changes
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleUserDetails = (record) => {
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id) => {
    setLoadingItems((prev) => new Set(prev).add(id));

    try {
      await handleDelete(id);

      // Remove the deleted item from local state
      setData((prevData) => prevData.filter(item => item.id !== id));

      // Remove loading state
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      // Remove loading state on error
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
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
        columns={TableColumn({ handleUserDetails, loadingItems, handleToggleActive })}
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
