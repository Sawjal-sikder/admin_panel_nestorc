import React, { useEffect, useState, useCallback } from "react";
import useFetch from "../../hook/getData";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateFormModal from "../../hook/UpdateFormModal";
import useDelete from "../../hook/delete";
import ReusableTable from "../../hook/TableHook";
import CreateFormModal from "../../hook/CreateFormModal";
import FormModal from "../../hook/FormModal";

const Nearby = () => {
  const [nearData, setNearData] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selecteddata, setSelectedData] = useState(null);

  const { data: Nearby, loading, error } = useFetch("/services/nearby-attractions/");
  const { handleDelete: deleteData } = useDelete("/services/nearby-attractions");

  useEffect(() => {
    if (Nearby) setNearData(Nearby);
  }, [Nearby]);

  const handleCreated = useCallback((newdata) => {
    setNearData((prev) => [...prev, newdata]);
    setCreateModal(false);
  }, []);

  const handleUpdated = useCallback((updatedData) => {
    setNearData((prev) =>
      prev.map((data) => (data.id === updatedData.id ? updatedData : data))
    );
    setUpdateModal(false);
  }, []);

  const handleDelete = useCallback(
    async (dataId) => {
      if (!window.confirm("Are you sure you want to delete this data?")) return;

      try {
        await deleteData(dataId);
        setNearData((prev) => prev.filter((data) => data.id !== dataId));
      } catch {
        alert("Failed to delete data. Please try again.");
      }
    },
    [deleteData]
  );

  const handleEdit = useCallback((data) => {
    setSelectedData(data);
    setUpdateModal(true);
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
    { header: "description", accessor: "description" },
    { header: "category", accessor: "category" },
    { header: "latitude", accessor: "latitude" },
    { header: "longitude", accessor: "longitude" },
    

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
      onClick: (row) => handleDelete(row.id),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold ps-5 text-gray-500">list of Near By Attractions</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setCreateModal(true)}
        >
          Create New Attraction
        </button>
      </div>

      {/* Reusable Table */}
      <ReusableTable columns={columns} data={nearData} actions={actions} />


      <FormModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={handleCreated}
        endpoint="/services/nearby-attractions/"
        title="Create Nearby Attraction"
        fields={[
          { name: "title", label: "Attraction Title", type: "text", placeholder: "Enter attraction title", required: true },
          { name: "description", label: "Description", type: "textarea", placeholder: "Enter description", required: true },
          { name: "category", label: "Category", type: "select", placeholder: "Select category", required: true, options: [
            { value: "Arts", label: "Arts" },
            { value: "Parks", label: "Parks" }
          ]},
          { name: "image", label: "Image", type: "file", placeholder: "Upload image", required: false },
          { name: "latitude", label: "Latitude", type: "text", step: "any", required: true, placeholder: "Latitude: 32.810894......" },
          { name: "longitude", label: "Longitude", type: "text", step: "any", required: true, placeholder: "Longitude: -96.778800......" }
        ]}
        mode="create"
      />
      {selecteddata?.id && (
        <FormModal
          isOpen={updateModal}
          onClose={() => setUpdateModal(false)}
          onSuccess={handleUpdated}
          endpoint={`/services/nearby-attractions/${selecteddata.id}/`}
          title="Update Nearby Attraction"
          data={selecteddata}
          fields={[
            { name: "title", label: "Attraction Title", type: "text", placeholder: "Enter attraction title", required: true },
            { name: "description", label: "Description", type: "textarea", placeholder: "Enter description", required: true },
            { name: "category", label: "Category", type: "select", placeholder: "Select category", required: true, options: [
              { value: "Arts", label: "Arts" },
              { value: "Parks", label: "Parks" }
            ]},
            { name: "image", label: "Image", type: "file", placeholder: "Upload image", required: false },
            { name: "latitude", label: "Latitude", type: "text", step: "any", required: true, placeholder: "Latitude: 32.810894......" },
            { name: "longitude", label: "Longitude", type: "text", step: "any", required: true, placeholder: "Longitude: -96.778800......" }
          ]}
          mode="update Nearby Attraction"
        />
      )}


    </div>
  );
};

export default Nearby;
