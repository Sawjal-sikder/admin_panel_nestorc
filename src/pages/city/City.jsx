import React, { useEffect, useState, useCallback } from "react";
import useFetch from "../../hook/getData";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateCityModal from "./CreateCityModal";
import UpdateCityModal from "./UpdateCityModal";
import useDelete from "../../hook/delete";
import ReusableTable from "../../hook/TableHook";

const City = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [createCityModal, setCreateCityModal] = useState(false);
  const [updateCityModal, setUpdateCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const { data: cities, loading, error } = useFetch("/services/cities/");
  const { handleDelete } = useDelete("/services/cities");

  useEffect(() => {
    if (cities) setCitiesData(cities);
  }, [cities]);

  const handleCityCreated = useCallback((newCity) => {
    setCitiesData((prev) => [...prev, newCity]);
    setCreateCityModal(false);
  }, []);

  const handleCityUpdated = useCallback((updatedCity) => {
    setCitiesData((prev) =>
      prev.map((city) => (city.id === updatedCity.id ? updatedCity : city))
    );
    setUpdateCityModal(false);
  }, []);

  const handleDeleteCity = useCallback(
    async (cityId) => {
      if (!window.confirm("Are you sure you want to delete this city?")) return;

      try {
        await handleDelete(cityId);
        setCitiesData((prev) => prev.filter((city) => city.id !== cityId));
      } catch {
        alert("Failed to delete city. Please try again.");
      }
    },
    [handleDelete]
  );

  const handleEdit = useCallback((city) => {
    setSelectedCity(city);
    setUpdateCityModal(true);
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // Define table columns
  const columns = [
    { header: "SL No", render: (row, index) => index + 1 },
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
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
      onClick: (row) => handleDeleteCity(row.id),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold ps-5 text-gray-500">City List</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setCreateCityModal(true)}
        >
          Create City
        </button>
      </div>

      {/* Reusable Table */}
      <ReusableTable columns={columns} data={citiesData} actions={actions} />

      {/* Modals */}
      <CreateCityModal
        isOpen={createCityModal}
        onClose={() => setCreateCityModal(false)}
        onCityCreated={handleCityCreated}
      />
      <UpdateCityModal
        isOpen={updateCityModal}
        onClose={() => setUpdateCityModal(false)}
        onCityUpdated={handleCityUpdated}
        city={selectedCity}
      />
    </div>
  );
};

export default City;
