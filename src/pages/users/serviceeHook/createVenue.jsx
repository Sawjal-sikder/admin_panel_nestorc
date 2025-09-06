import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import useFetchData from "../../../hook/selectHook";

const CreateVenue = ({ onSuccess }) => {
      const [venueName, setVenueName] = useState("");
      const [latLon, setLatLon] = useState("");
      const [description, setDescription] = useState("");
      const [city, setCity] = useState("");
      const [place, setPlace] = useState("");
      const [image, setImage] = useState(null);
      const [loading, setLoading] = useState(false);
      const [errors, setErrors] = useState({});
      const [scavengerHunts, setScavengerHunts] = useState([]);
      const [venueMessages, setVenueMessages] = useState([]);

      // Fetch cities and places at the top level
      const { data: cities, loading: citiesLoading } = useFetchData("/services/cities/");
      const { data: places, loading: placesLoading } = useFetchData("/services/places/");

      const validateForm = () => {
            const newErrors = {};

            if (!venueName.trim()) newErrors.venueName = true;
            if (!latLon.trim()) newErrors.latLon = true;
            if (!description.trim()) newErrors.description = true;
            if (!city) newErrors.city = true;
            if (!place) newErrors.place = true;

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
      };

      const addScavengerHunt = () => {
            setScavengerHunts([...scavengerHunts, { title: "" }]);
      };

      const removeScavengerHunt = (index) => {
            const updatedHunts = scavengerHunts.filter((_, i) => i !== index);
            setScavengerHunts(updatedHunts);
      };

      const updateScavengerHunt = (index, field, value) => {
            const updatedHunts = scavengerHunts.map((hunt, i) =>
                  i === index ? { ...hunt, [field]: value } : hunt
            );
            setScavengerHunts(updatedHunts);
      };

      const addVenueMessage = () => {
            setVenueMessages([...venueMessages, { id: Date.now(), message: "" }]);
      };

      const removeVenueMessage = (index) => {
            const updatedMessages = venueMessages.filter((_, i) => i !== index);
            setVenueMessages(updatedMessages);
      };

      const updateVenueMessage = (index, value) => {
            const updatedMessages = venueMessages.map((msg, i) =>
                  i === index ? { ...msg, message: value } : msg
            );
            setVenueMessages(updatedMessages);
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                  return;
            }

            setLoading(true);

            try {
                  // Validate and parse latitude/longitude
                  const latLonParts = latLon.split(",");
                  if (latLonParts.length !== 2) {
                        alert("Please enter latitude and longitude in the format: latitude, longitude");
                        setLoading(false);
                        return;
                  }

                  const latitude = parseFloat(latLonParts[0].trim());
                  const longitude = parseFloat(latLonParts[1].trim());

                  if (isNaN(latitude) || isNaN(longitude)) {
                        alert("Please enter valid numeric values for latitude and longitude");
                        setLoading(false);
                        return;
                  }

                  // Validate latitude and longitude ranges
                  if (latitude < -90 || latitude > 90) {
                        alert("Latitude must be between -90 and 90");
                        setLoading(false);
                        return;
                  }

                  if (longitude < -180 || longitude > 180) {
                        alert("Longitude must be between -180 and 180");
                        setLoading(false);
                        return;
                  }

                  // console.log("Parsed coordinates:", { latitude, longitude });

                  const formData = new FormData();
                  formData.append("venue_name", venueName);
                  formData.append("latitude", latitude);
                  formData.append("longitude", longitude);
                  formData.append("description", description);
                  formData.append("city", Number(city));
                  formData.append("type_of_place", Number(place));

                  if (image) {
                        formData.append("image", image);
                  }

                  // Prepare scavenger_hunts and venue_message arrays in the exact format the API expects
                  const huntsData = scavengerHunts
                        .filter(hunt => hunt.title && hunt.title.trim())
                        .map(hunt => ({ title: hunt.title.trim() }));

                  const messagesData = venueMessages
                        .filter(msg => msg.message && msg.message.trim())
                        .map(msg => ({ message: msg.message.trim() }));

                  // Try sending nested arrays as individual FormData fields
                  huntsData.forEach((hunt, index) => {
                        formData.append(`scavenger_hunts[${index}][title]`, hunt.title);
                  });

                  messagesData.forEach((message, index) => {
                        formData.append(`venue_message[${index}][message]`, message.message);
                  });

                  // console.log("FormData contents:");
                  for (let [key, value] of formData.entries()) {
                        // console.log(key, value);
                  }

                  // console.log("Scavenger hunts being sent:", huntsData);
                  // console.log("Venue messages being sent:", messagesData);
                  // console.log("Sending all data in single request including nested arrays");

                  const res = await API.post("/services/venues/create/", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                  });

                  // console.log("Venue created successfully:", res.data);

                  // Reset form
                  setVenueName("");
                  setLatLon("");
                  setDescription("");
                  setCity("");
                  setPlace("");
                  setImage(null);
                  setScavengerHunts([]);
                  setVenueMessages([]);
                  setErrors({});

                  if (onSuccess) onSuccess(res.data);
            } catch (err) {
                  console.error("Error creating venue:", err);
                  console.error("Error response:", err.response?.data || err);
                  console.error("Error status:", err.response?.status);
                  console.error("Error headers:", err.response?.headers);

                  // Show more specific error message
                  const errorMessage = err.response?.data?.message ||
                        err.response?.data?.error ||
                        JSON.stringify(err.response?.data) ||
                        "Failed to create venue. Please try again.";
                  alert(`Error: ${errorMessage}`);
            } finally {
                  setLoading(false);
            }
      };

      return (
            <form
                  onSubmit={handleSubmit}
                  className="max-w-2xl mx-auto p-6 border-t-2 border-gray-200 space-y-6"
            >
                  {/* Venue Name */}
                  <div className="flex flex-col">
                        <label className="mb-1 font-medium">Venue Name</label>
                        <input
                              type="text"
                              className={`border rounded px-3 py-2 ${errors.venueName
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                              value={venueName}
                              onChange={(e) => {
                                    setVenueName(e.target.value);
                                    if (errors.venueName) {
                                          setErrors(prev => ({ ...prev, venueName: false }));
                                    }
                              }}
                              placeholder="Lower Greenville Dallas, TX, USA"
                        />
                        {errors.venueName && (
                              <span className="text-red-500 text-sm mt-1">Venue name is required</span>
                        )}
                  </div>

                  {/* Latitude & Longitude */}
                  <div className="flex flex-col">
                        <label className="mb-1 font-medium">Latitude & Longitude</label>
                        <input
                              type="text"
                              placeholder="32.665067, -96.774068"
                              className={`border rounded px-3 py-2 ${errors.latLon
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                              value={latLon}
                              onChange={(e) => {
                                    setLatLon(e.target.value);
                                    if (errors.latLon) {
                                          setErrors(prev => ({ ...prev, latLon: false }));
                                    }
                              }}
                        />
                        {errors.latLon && (
                              <span className="text-red-500 text-sm mt-1">Latitude & Longitude is required</span>
                        )}
                  </div>

                  {/* Description */}
                  <div className="flex flex-col">
                        <label className="mb-1 font-medium">Description</label>
                        <textarea
                              className={`border rounded px-3 py-2 ${errors.description
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                              value={description}
                              onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (errors.description) {
                                          setErrors(prev => ({ ...prev, description: false }));
                                    }
                              }}
                        ></textarea>
                        {errors.description && (
                              <span className="text-red-500 text-sm mt-1">Description is required</span>
                        )}
                  </div>

                  {/* City */}
                  <div className="flex flex-col">
                        <label className="mb-1 font-medium">City</label>
                        <select
                              className={`border rounded px-3 py-2 ${errors.city
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                              value={city}
                              onChange={(e) => {
                                    setCity(e.target.value);
                                    if (errors.city) {
                                          setErrors(prev => ({ ...prev, city: false }));
                                    }
                              }}
                        >
                              <option value="">Select a city</option>
                              {cities?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                          {c.name}
                                    </option>
                              ))}
                        </select>
                        {errors.city && (
                              <span className="text-red-500 text-sm mt-1">City selection is required</span>
                        )}
                  </div>

                  {/* Place */}
                  <div className="flex flex-col">
                        <label className="mb-1 font-medium">Place</label>
                        <select
                              className={`border rounded px-3 py-2 ${errors.place
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                              value={place}
                              onChange={(e) => {
                                    setPlace(e.target.value);
                                    if (errors.place) {
                                          setErrors(prev => ({ ...prev, place: false }));
                                    }
                              }}
                        >
                              <option value="">Select a place</option>
                              {places?.map((p) => (
                                    <option key={p.id} value={p.id}>
                                          {p.name}
                                    </option>
                              ))}
                        </select>
                        {errors.place && (
                              <span className="text-red-500 text-sm mt-1">Place selection is required</span>
                        )}
                  </div>

                  {/* Scavenger Hunts Section */}
                  <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                              <label className="font-medium">Scavenger Hunts</label>
                              <button
                                    type="button"
                                    onClick={addScavengerHunt}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                    Add Scavenger Hunt
                              </button>
                        </div>

                        {scavengerHunts.map((hunt, index) => (
                              <div key={index} className="flex items-center mb-3">
                                    <input
                                          type="text"
                                          className="border border-gray-300 rounded px-3 py-2 w-full"
                                          value={hunt.title}
                                          onChange={(e) => updateScavengerHunt(index, 'title', e.target.value)}
                                          placeholder="Enter scavenger hunt title"
                                    />
                                    <button
                                          type="button"
                                          onClick={() => removeScavengerHunt(index)}
                                          className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                    >
                                          Remove
                                    </button>
                              </div>
                        ))}
                  </div>

                  {/* Venue Messages Section */}
                  <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                              <label className="font-medium">Venue Messages</label>
                              <button
                                    type="button"
                                    onClick={addVenueMessage}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                    Add Message
                              </button>
                        </div>

                        {venueMessages.map((msg, index) => (
                              <div key={msg.id} className="flex items-center mb-3">
                                    <input
                                          type="text"
                                          className="border border-gray-300 rounded px-3 py-2 w-full"
                                          value={msg.message}
                                          onChange={(e) => updateVenueMessage(index, e.target.value)}
                                          placeholder="Enter venue message"
                                    />
                                    <button
                                          type="button"
                                          onClick={() => removeVenueMessage(index)}
                                          className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                    >
                                          Remove
                                    </button>
                              </div>
                        ))}
                  </div>
                  <div className="flex flex-col">
                        <label className="mb-1 font-medium">Upload Image</label>
                        <input
                              type="file"
                              accept="image/*"
                              className="border border-gray-300 rounded px-3 py-2"
                              onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image && (
                              <img
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    className="mt-2 h-32 w-auto border"
                              />
                        )}
                  </div>

                  {/* Submit Button */}
                  <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                        {loading ? "Creating..." : "Submit"}
                  </button>
            </form>
      );
};

export default CreateVenue;
