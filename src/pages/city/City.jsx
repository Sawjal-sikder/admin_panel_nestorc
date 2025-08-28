import React, { useEffect, useState } from "react";
import useFetch from "../../hook/getData";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateCityModal from "./CreateCityModal";
import useDelete from "../../hook/delete";
import UpdateCityModal from "./UpdateCityModal";

const City = () => {

  const [createCityModal, setCreateCityModal] = useState(false);
  const [citiesData, setCitiesData] = useState([]);
  const [updateCityModal, setUpdateCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const { data: cities, loading, error } = useFetch("/services/cities/");
  const { handleDelete, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDelete("/services/cities");

  // Initialize local state when fetched
  useEffect(() => {
    if (cities) setCitiesData(cities);
  }, [cities]);

  // Watch for delete success and update UI accordingly
  useEffect(() => {
    if (deleteSuccess) {
      // Refetch data or handle success
      // console.log("Delete operation completed successfully");
    }
  }, [deleteSuccess]);

  // Callback when a new city is created
  const handleCityCreated = (newCity) => {
    setCitiesData((prev) => [...prev, newCity]);
    setCreateCityModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleDeleteCity = async (cityId) => {
    // confirm delete for windows
    const confirmed = window.confirm("Are you sure you want to delete this city?");
    if (!confirmed) return;

    try {
      await handleDelete(cityId);
      // Remove from local state immediately after API call
      setCitiesData((prev) => prev.filter((city) => city.id !== cityId));
    } catch (error) {
      // console.error("Failed to delete city:", error);
      alert("Failed to delete city. Please try again.");
    }
  };

  const handleCityUpdated = (updatedCity) => {
    setCitiesData((prev) =>
      prev.map((city) => (city.id === updatedCity.id ? updatedCity : city))
    );
    setUpdateCityModal(false);
  };

  const handleEdit = (city) => {
    // console.log("Editing city:", city); // Add this debug line
    setSelectedCity(city);
    setUpdateCityModal(true);
  };

  return (
    <div className="p-6">
      {/* Header with button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold ps-5 text-gray-500">City List</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setCreateCityModal(true)}
        >
          Create City
        </button>
      </div>

      {/* Table container with card style */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-[#fafafa] text-center">
              <th className="px-4 py-5 border-l border-b">SL No</th>
              <th className="px-4 py-5 border-l border-b">Name</th>
              <th className="px-4 py-5 border-l border-b">Description</th>
              <th className="px-4 py-5 border-l border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {citiesData?.map((city, index) => (
              <tr
                key={city.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-5 border-l border-b text-center">{index + 1}</td>
                <td className="px-4 py-5 border-l border-b">{city.name}</td>
                <td className="px-4 py-5 border-l border-b">{city.description}</td>
                <td className="px-4 py-5 border-l border-b flex gap-5 justify-center">
                  {/* Edit button */}
                  <button
                    className="text-blue-500 hover:underline flex items-center gap-1"
                    onClick={() => handleEdit(city)} // Make sure this is city, not city.id
                  >
                    <FaEdit /> Edit
                  </button>

                  {/* Delete button */}
                  <button className="text-red-500 hover:underline flex items-center gap-1" onClick={() => handleDeleteCity(city.id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Create City Modal */}
      <CreateCityModal
        isOpen={createCityModal}
        onClose={() => setCreateCityModal(false)}
        onCityCreated={handleCityCreated}
      />
      {/* Update City Modal */}
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
