import React, { useState, useEffect } from "react";
import { Table, Modal, message } from "antd";
import servicedataHook from "./serviceeHook/servicedataHook";
import TableColumn from "./serviceeHook/TableColumn/servicecolumn";
import DetailsModal from "./serviceDetails";
import CreateVenue from "./serviceeHook/createVenue";
import UpdateVenue from "./serviceeHook/updateVenue";
import useDelete from "../../hook/delete";
import CreatePremiumTour from "./serviceeHook/CreatePremium";

const MainComponent = () => {
  const { data: initialData, loading, error, refetch } = servicedataHook();
  const { handleDelete, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDelete("/services/venues");

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCreateVenue, setIsModalOpenCreateVenue] = useState(false);
  const [isModalOpenCreateFreeTour, setIsModalOpenCreateFreeTour] = useState(false);
  const [isModalOpenCreatePremiumTour, setIsModalOpenCreatePremiumTour] = useState(false);
  const [isModalOpenUpdateVenue, setIsModalOpenUpdateVenue] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedVenueForUpdate, setSelectedVenueForUpdate] = useState(null);
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
      setData((prevData) => prevData.filter(item => item.id !== id));
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleCreateFreeTour = () => {
    setIsModalOpenCreateFreeTour(true);
  };

  const handleCreatePremiumTour = () => {
    setIsModalOpenCreatePremiumTour(true);
  };

  // State to trigger refetch after venue creation
  const [venueCreated, setVenueCreated] = useState(false);

  // Callback to refresh data after venue creation
  const handleVenueCreated = (newVenue) => {
    // Add the new venue to the existing data
    if (newVenue) {
      setData((prevData) => [...prevData, newVenue]);
      message.success("Venue created successfully!");
    }

    // Close the modal
    setIsModalOpenCreateVenue(false);

    // Optionally refetch data to ensure consistency with server
    if (typeof refetch === 'function') {
      refetch();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;



  const handleUserEdit = (record) => {
    setSelectedVenueForUpdate(record);
    setIsModalOpenUpdateVenue(true);
    // console.log("Edit record:", record);
  };

  // Callback to handle successful venue update
  const handleVenueUpdated = (updatedVenue) => {
    // Update the venue in the existing data
    if (updatedVenue) {
      setData((prevData) =>
        prevData.map(venue =>
          venue.id === updatedVenue.id ? updatedVenue : venue
        )
      );
      message.success("Venue updated successfully!");
    }

    // Close the modal
    setIsModalOpenUpdateVenue(false);
    setSelectedVenueForUpdate(null);

    // Optionally refetch data to ensure consistency with server
    if (typeof refetch === 'function') {
      refetch();
    }
  };

  // Callback to handle update modal cancel
  const handleUpdateCancel = () => {
    setIsModalOpenUpdateVenue(false);
    setSelectedVenueForUpdate(null);
  };


  return (
    <>
      <div className="flex justify-end mb-4 gap-x-5">
        <button
          onClick={handleCreateFreeTour}
          className="bg-blue-600 text-white border-none px-4 py-2 rounded cursor-pointer font-medium shadow"
        >
          Create Free Tour
        </button>
      {/* </div>
      <div className="flex justify-end mb-4"> */}
        <button
          onClick={handleCreatePremiumTour}
          className="bg-blue-600 text-white border-none px-4 py-2 rounded cursor-pointer font-medium shadow"
        >
          Create Premium Tour
        </button>
      </div>

      <Table
        columns={TableColumn({ handleUserDetails, handleUserEdit, loadingItems, handleToggleActive })}
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

      {/* Create Free Tour Modal */}
      <Modal
        title="Create Free Tour"
        open={isModalOpenCreateFreeTour}
        onCancel={() => setIsModalOpenCreateFreeTour(false)}
        footer={null}
        destroyOnHidden={true}
        width={800}
        centered
        className="px-10"  
      >
        <CreateVenue onSuccess={handleVenueCreated} />
      </Modal>

      {/* Create Premium Tour Modal */}
      <Modal
        title="Create Premium Tour"
        open={isModalOpenCreatePremiumTour}
        onCancel={() => setIsModalOpenCreatePremiumTour(false)}
        footer={null}
        destroyOnHidden={true}
        width={800}
        centered
        className="px-10"  // Add horizontal padding to the modal
      >
        <CreatePremiumTour onSuccess={handleVenueCreated} />
      </Modal>

      {/* Update Tour Modal */}
      <Modal
        title="Update Tour"
        open={isModalOpenUpdateVenue}
        onCancel={handleUpdateCancel}
        footer={null}
        destroyOnHidden={true}
        width={800}
        centered
        className="px-10"  // Add horizontal padding to the modal
      >
        {selectedVenueForUpdate && (
          <UpdateVenue
            venueData={selectedVenueForUpdate}
            onSuccess={handleVenueUpdated}
            onCancel={handleUpdateCancel}
          />
        )}
      </Modal>
    </>
  );
};

export default MainComponent;
