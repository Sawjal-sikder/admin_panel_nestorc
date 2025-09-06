import React, { useState, useEffect } from "react";
import useApiUpdate from "../../hook/updateVenue";

const UpdateVenueModal = ({
      isOpen,
      onClose,
      onSuccess,
      endpoint,
      data,
      cityOptions,
      typeOptions,
      cityselectLoading,
      typeOfPlaceLoading,
}) => {
      const { updateData, loading, error } = useApiUpdate();

      // Initialize formData with safe defaults
      const [formData, setFormData] = useState({
            venue_name: "",
            latitude: "",
            longitude: "",
            city: "",
            type_of_place: "",
            description: "",
            image: null,
      });

      // Pre-fill form when modal opens and data is available
      useEffect(() => {
            if (isOpen && data) {
                  console.log("Venue data:", data);
                  console.log("City options:", cityOptions);
                  console.log("Type options:", typeOptions);

                  // Handle different data structures for city
                  let cityValue = "";
                  if (typeof data.city === 'object' && data.city?.id) {
                        // If city is an object with id
                        cityValue = data.city.id;
                  } else if (typeof data.city === 'string') {
                        // If city is a string, find matching option
                        const cityOption = cityOptions.find(option => option.label === data.city);
                        cityValue = cityOption ? cityOption.value : "";
                  } else if (typeof data.city === 'number') {
                        // If city is already an ID
                        cityValue = data.city;
                  }

                  // Handle different data structures for type_of_place
                  let typeValue = "";
                  if (typeof data.type_of_place === 'object' && data.type_of_place?.id) {
                        // If type_of_place is an object with id
                        typeValue = data.type_of_place.id;
                  } else if (typeof data.type_of_place === 'string') {
                        // If type_of_place is a string, find matching option
                        const typeOption = typeOptions.find(option => option.label === data.type_of_place);
                        typeValue = typeOption ? typeOption.value : "";
                  } else if (typeof data.type_of_place === 'number') {
                        // If type_of_place is already an ID
                        typeValue = data.type_of_place;
                  }

                  console.log("Final city value:", cityValue);
                  console.log("Final type value:", typeValue);

                  setFormData(prev => ({
                        ...prev,
                        venue_name: data.venue_name || "",
                        latitude: data.latitude || "",
                        longitude: data.longitude || "",
                        city: cityValue,
                        type_of_place: typeValue,
                        description: data.description || "",
                        image: null, // file input should always start as null
                  }));
            }
      }, [isOpen, data, cityOptions, typeOptions]);

      if (!isOpen) return null;

      const handleChange = e => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleFileChange = e => {
            setFormData({ ...formData, image: e.target.files[0] });
      };

      const handleSubmit = async e => {
            e.preventDefault();

            console.log("Form data before submit:", formData);

            try {
                  const formDataObj = new FormData();

                  // Prepare data with proper validation
                  const dataToSend = {
                        venue_name: formData.venue_name || data.venue_name,
                        latitude: formData.latitude || data.latitude,
                        longitude: formData.longitude || data.longitude,
                        city: formData.city || (typeof data.city === 'string' ?
                              cityOptions.find(opt => opt.label === data.city)?.value : data.city),
                        type_of_place: formData.type_of_place || (typeof data.type_of_place === 'string' ?
                              typeOptions.find(opt => opt.label === data.type_of_place)?.value : data.type_of_place),
                        description: formData.description || data.description || "",
                  };

                  console.log("Data to send:", dataToSend);

                  // Add all form fields
                  Object.keys(dataToSend).forEach(key => {
                        if (dataToSend[key] !== null && dataToSend[key] !== undefined && dataToSend[key] !== '') {
                              formDataObj.append(key, dataToSend[key]);
                        }
                  });

                  // Add image only if a new file is selected
                  if (formData.image !== null) {
                        formDataObj.append('image', formData.image);
                  }

                  // Debug: Log what's being sent
                  console.log("FormData entries:");
                  for (let [key, value] of formDataObj.entries()) {
                        console.log(key, value);
                  }

                  const result = await updateData(endpoint, formDataObj, true); // true → multipart
                  console.log("Update result:", result);
                  if (onSuccess) onSuccess(result);
                  onClose();
            } catch (err) {
                  console.error("Update error:", err);
            }
      };

      return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-2xl text-center text-gray-600 font-semibold mb-6">
                              Update Venue
                        </h2>

                        {loading && <p className="text-blue-600 mb-2">Updating...</p>}
                        {error && <p className="text-red-600 mb-2">{JSON.stringify(error)}</p>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                              {/* Venue Name */}
                              <div>
                                    <label className="block font-medium">Venue Name *</label>
                                    <input
                                          type="text"
                                          name="venue_name"
                                          value={formData.venue_name ?? ""}
                                          onChange={handleChange}
                                          placeholder="Enter venue name"
                                          className="w-full border rounded-lg p-2"
                                          required
                                    />
                              </div>

                              {/* Latitude */}
                              <div>
                                    <label className="block font-medium">Latitude *</label>
                                    <input
                                          type="text"
                                          name="latitude"
                                          value={formData.latitude ?? ""}
                                          onChange={handleChange}
                                          placeholder="Enter latitude"
                                          className="w-full border rounded-lg p-2"
                                          required
                                    />
                              </div>

                              {/* Longitude */}
                              <div>
                                    <label className="block font-medium">Longitude *</label>
                                    <input
                                          type="text"
                                          name="longitude"
                                          value={formData.longitude ?? ""}
                                          onChange={handleChange}
                                          placeholder="Enter longitude"
                                          className="w-full border rounded-lg p-2"
                                          required
                                    />
                              </div>

                              {/* City */}
                              <div>
                                    <label className="block font-medium">City *</label>
                                    <select
                                          name="city"
                                          value={formData.city ?? ""}
                                          onChange={handleChange}
                                          className="w-full border rounded-lg p-2"
                                          required
                                    >
                                          <option value="">Select City</option>
                                          {cityselectLoading ? (
                                                <option>Loading...</option>
                                          ) : (
                                                cityOptions.map((opt, i) => (
                                                      <option key={i} value={opt.value}>
                                                            {opt.label}
                                                      </option>
                                                ))
                                          )}
                                    </select>
                              </div>

                              {/* Type of Place */}
                              <div>
                                    <label className="block font-medium">Type of Place *</label>
                                    <select
                                          name="type_of_place"
                                          value={formData.type_of_place ?? ""}
                                          onChange={handleChange}
                                          className="w-full border rounded-lg p-2"
                                          required
                                    >
                                          <option value="">Select Type</option>
                                          {typeOfPlaceLoading ? (
                                                <option>Loading...</option>
                                          ) : (
                                                typeOptions.map((opt, i) => (
                                                      <option key={i} value={opt.value}>
                                                            {opt.label}
                                                      </option>
                                                ))
                                          )}
                                    </select>
                              </div>

                              {/* Description */}
                              <div>
                                    <label className="block font-medium">Description</label>
                                    <textarea
                                          name="description"
                                          value={formData.description ?? ""}
                                          onChange={handleChange}
                                          placeholder="Enter description"
                                          className="w-full border rounded-lg p-2"
                                          rows={4}
                                    />
                              </div>

                              {/* Image */}
                              <div>
                                    <label className="block font-medium">Image</label>
                                    {data?.image && (
                                          <div className="mb-2">
                                                <p className="text-sm text-gray-600">Current image: {data.image}</p>
                                          </div>
                                    )}
                                    <input
                                          type="file"
                                          name="image"
                                          onChange={handleFileChange}
                                          className="w-full border rounded-lg p-2"
                                          accept="image/*"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                              </div>

                              {/* Buttons */}
                              <div className="flex justify-end gap-3 mt-4">
                                    <button
                                          type="button"
                                          onClick={onClose}
                                          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                          Cancel
                                    </button>
                                    <button
                                          type="submit"
                                          disabled={loading}
                                          className={`px-4 py-2 text-white rounded ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                    >
                                          {loading ? "Updating..." : "Update"}
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default UpdateVenueModal;
