import React, { useEffect, useState, useCallback } from "react";
import useFetch from "../../hook/getData";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateFormModal from "../../hook/UpdateFormModal";
import useDelete from "../../hook/delete";
import ReusableTable from "../../hook/TableHook";
import CreateFormModal from "../../hook/CreateFormModal";
import FormModal from "../../hook/FormModal";

const GeoFences = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [createCityModal, setCreateCityModal] = useState(false);
  const [updateCityModal, setUpdateCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const { data: GeoFences, loading, error } = useFetch("/services/geofences/");
  const { handleDelete } = useDelete("/services/geofences");

  useEffect(() => {
    if (GeoFences) setCitiesData(GeoFences);
  }, [GeoFences]);

  const handleCreated = useCallback((newdata) => {
    setCitiesData((prev) => [...prev, newdata]);
    setCreateCityModal(false);
  }, []);

  const handleCityUpdated = useCallback((updatedCity) => {
    setCitiesData((prev) =>
      prev.map((city) => (city.id === updatedCity.id ? updatedCity : city))
    );
    setUpdateCityModal(false);
  }, []);

  const handleDeletegeofence = useCallback(
    async (geofenceId) => {
      if (!window.confirm("Are you sure you want to delete this geofence?")) return;

      try {
        await handleDelete(geofenceId);
        setCitiesData((prev) => prev.filter((city) => city.id !== geofenceId));
      } catch {
        alert("Failed to delete geofence. Please try again.");
      }
    },
    [handleDelete]
  );

  const handleEdit = useCallback((city) => {
    console.log("Selected city:", city); // Debug log
    console.log("City ID:", city?.id); // Debug log
    setSelectedCity(city);
    setUpdateCityModal(true);
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
    { header: "Title", accessor: "title" },
    { header: "Alert Message", accessor: "alertMessage" },
    {
      header: "Polygon Points",
      render: (row) =>
        row.polygon_points.map((point, i) => (
          <span
            key={i}
            className="inline-block bg-blue-100 text-black text-xs px-2 py-1 rounded-full mr-2 mb-1"
          >
            {point.latitude}, {point.longitude}
          </span>
        )),
    }

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
      onClick: (row) => handleDeletegeofence(row.id),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold ps-5 text-gray-500">Geo Fences list</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setCreateCityModal(true)}
        >
          Create Geo Fence
        </button>
      </div>

      {/* Reusable Table */}
      <ReusableTable columns={columns} data={citiesData} actions={actions} />

      {/* Modals */}
      {/* <CreateFormModal
        isOpen={createCityModal}
        onClose={() => setCreateCityModal(false)}
        onCreated={handleCreated}
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
      />


      {selectedCity && selectedCity.id && (() => {
        const endpoint = `/services/geofences/${selectedCity.id}/`;
        console.log("Endpoint being passed:", endpoint, typeof endpoint); // Debug log
        return (
          <UpdateFormModal
            isOpen={updateCityModal}
            onClose={() => setUpdateCityModal(false)}
            onUpdated={handleCityUpdated}
            endpoint={endpoint}
            title="Update Geofence"
            data={selectedCity}
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
          />
        );
      })()} */}

      <FormModal
        isOpen={createCityModal}
        onClose={() => setCreateCityModal(false)}
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
      {selectedCity?.id && (
        <FormModal
          isOpen={updateCityModal}
          onClose={() => setUpdateCityModal(false)}
          onSuccess={handleCityUpdated}
          endpoint={`/services/geofences/${selectedCity.id}/`}
          title="Update Geofence"
          data={selectedCity}
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
          mode="update"
        />
      )}


    </div>
  );
};

export default GeoFences;
