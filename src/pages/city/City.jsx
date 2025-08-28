import React, { useState } from "react";
import useFetch from "../../hook/getData";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateCity from "./CreateCityModal";
import CreateCityModal from "./CreateCityModal";

const City = () => {

  const [createCityModal, setCreateCityModal] = useState(false);

  const { data: cities, loading, error } = useFetch("/services/cities/");

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
            {cities?.map((city, index) => (
              <tr
                key={city.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-5 border-l border-b text-center">{index + 1}</td>
                <td className="px-4 py-5 border-l border-b">{city.name}</td>
                <td className="px-4 py-5 border-l border-b">{city.description}</td>
                <td className="px-4 py-5 border-l border-b flex gap-5 justify-center">
                  {/* Edit button */}
                  <button className="text-blue-500 hover:underline flex items-center gap-1">
                    <FaEdit /> Edit
                  </button>

                  {/* Delete button */}
                  <button className="text-red-500 hover:underline flex items-center gap-1">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Create City Modal */}
      <CreateCityModal isOpen={createCityModal} onClose={() => setCreateCityModal(false)} />
    </div>
  );
};

export default City;
