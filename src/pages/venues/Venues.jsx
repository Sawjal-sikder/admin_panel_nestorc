import React, { useEffect, useState, useCallback } from "react";
import useFetch from "../../hook/getData";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateFormModal from "../../hook/UpdateFormModal";
import useDelete from "../../hook/delete";
import ReusableTable from "../../hook/TableHook";
import CreateFormModal from "../../hook/CreateFormModal";
import FormModal from "../../hook/FormModal";

const Venues = () => {
  const [venuesData, setVenuesData] = useState([]);
  const [createVenueModal, setCreateVenueModal] = useState(false);
  const [updateVenueModal, setUpdateVenueModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const { data: Venues, loading, error } = useFetch("/services/venues/");
  const { handleDelete } = useDelete("/services/venues");

  useEffect(() => {
    if (Venues) setVenuesData(Venues);
  }, [Venues]);

  const handleCreated = useCallback((newdata) => {
    setVenuesData((prev) => [...prev, newdata]);
    setCreateVenueModal(false);
  }, []);

  const handleVenueUpdated = useCallback((updatedVenue) => {
    setVenuesData((prev) =>
      prev.map((venue) => (venue.id === updatedVenue.id ? updatedVenue : venue))
    );
    setUpdateVenueModal(false);
  }, []);

  const handleDeleteVenue = useCallback(
    async (venueId) => {
      if (!window.confirm("Are you sure you want to delete this venue?")) return;

      try {
        await handleDelete(venueId);
        setVenuesData((prev) => prev.filter((venue) => venue.id !== venueId));
      } catch {
        alert("Failed to delete venue. Please try again.");
      }
    },
    [handleDelete]
  );

  const handleEdit = useCallback((venue) => {
    // console.log("Selected venue:", venue); // Debug log
    // console.log("Venue ID:", venue?.id); // Debug log
    setSelectedVenue(venue);
    setUpdateVenueModal(true);
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // Define table columns
  const columns = [
    {
      header: "SL No",
      render: (row, index) => (
        <p className="text-center font-semibold text-gray-700">
          {index + 1}
        </p>
      ),
    },
    { header: "Venue Name", accessor: "venue_name" },
    { header: "City", accessor: "city" },
    { header: "Type of Place", accessor: "type_of_place" },
    {
      header: "Coordinates",
      render: (row) => (
        <span className="inline-block bg-blue-100 text-black text-xs px-2 py-1 rounded-full mr-2 mb-1">
          {row.latitude}, {row.longitude}
        </span>
      ),
    },


  ];


  // Define actions
  const actions = [
    {
      label: "Edit",
      icon: <FaEdit />,
      className: "text-blue-500 hover:underline",
      onClick: (row) => handleEdit(row),
    },
    {
      label: "Delete",
      icon: <FaTrash />,
      className: "text-red-500 hover:underline",
      onClick: (row) => handleDeleteVenue(row.id),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold ps-5 text-gray-500">Geo Fences list</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setCreateVenueModal(true)}
        >
          Create Venue
        </button>
      </div>

      {/* Reusable Table */}
      <ReusableTable columns={columns} data={venuesData} actions={actions} />


      <FormModal
        isOpen={createVenueModal}
        onClose={() => setCreateVenueModal(false)}
        onSuccess={handleCreated}
        endpoint="/services/geofences/"
        title="Create Geofence"
        fields={[
          { name: "title", label: "Geofence Title", type: "text", placeholder: "Enter geofence title", required: true },
          { name: "alertMessage", label: "Alert Message", type: "textarea", placeholder: "Enter alert message", required: true },
          { name: "isRestricted", label: "Is Restricted", type: "boolean", placeholder: "Enter restriction status", required: true },
          {
            name: "polygon_points", label: "Polygon Points", type: "array", fields: [
              { name: "latitude", label: "Latitude", type: "text", step: "any", required: true, placeholder: "Latitude: 32.810894......" },
              { name: "longitude", label: "Longitude", type: "text", step: "any", required: true, placeholder: "Longitude: -96.778800......" }
            ]
          }
        ]}
        mode="create"
      />
      {selectedVenue?.id && (
        <FormModal
          isOpen={updateVenueModal}
          onClose={() => setUpdateVenueModal(false)}
          onSuccess={handleVenueUpdated}
          endpoint={`/services/geofences/${selectedVenue.id}/`}
          title="Update Venue"
          data={selectedVenue}
          fields={[
            { name: "title", label: "Venue Title", type: "text", placeholder: "Enter venue title", required: true },
            { name: "alertMessage", label: "Alert Message", type: "textarea", placeholder: "Enter alert message", required: true },
            { name: "isRestricted", label: "Is Restricted", type: "boolean", placeholder: "Enter restriction status", required: true },
            {
              name: "polygon_points", label: "Polygon Points", type: "array", fields: [
                { name: "latitude", label: "Latitude", type: "text", step: "any", required: true, placeholder: "Latitude: 32.810894......" },
                { name: "longitude", label: "Longitude", type: "text", step: "any", required: true, placeholder: "Longitude: -96.778800......" }
              ]
            }
          ]}
          mode="update"
        />
      )}


    </div>
  );
};

export default Venues;
