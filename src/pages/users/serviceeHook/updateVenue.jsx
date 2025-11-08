import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import useFetchData from "../../../hook/selectHook";

const UpdateVenue = ({ venueData, onSuccess, onCancel }) => {
      const [venueName, setVenueName] = useState("");
      const [latLon, setLatLon] = useState("");
      const [description, setDescription] = useState("");
      const [city, setCity] = useState("");
      const [place, setPlace] = useState("");
      const [image, setImage] = useState(null);
      const [currentImage, setCurrentImage] = useState("");
      const [loading, setLoading] = useState(false);
      const [errors, setErrors] = useState({});
      const [scavengerHunts, setScavengerHunts] = useState([]);
      const [venueMessages, setVenueMessages] = useState([]);
      const [stops, setStops] = useState([]);

      // Fetch cities and places at the top level
      const { data: cities, loading: citiesLoading } = useFetchData("/services/cities/");
      const { data: places, loading: placesLoading } = useFetchData("/services/places/");

      // Initialize form with existing venue data
      useEffect(() => {
            if (venueData) {
                  setVenueName(venueData.venue_name || "");
                  setLatLon(`${venueData.latitude || ""}, ${venueData.longitude || ""}`);
                  setDescription(venueData.description || "");
                  setCurrentImage(venueData.image || "");

                  // Set city - handle both object and ID formats
                  if (typeof venueData.city === 'object' && venueData.city?.id) {
                        setCity(venueData.city.id.toString());
                  } else if (typeof venueData.city === 'string') {
                        // Find city by name if it's a string
                        const foundCity = cities?.find(c => c.name === venueData.city);
                        setCity(foundCity?.id?.toString() || "");
                  } else if (typeof venueData.city === 'number') {
                        setCity(venueData.city.toString());
                  }

                  // Set place/type_of_place - handle both object and ID formats
                  if (typeof venueData.type_of_place === 'object' && venueData.type_of_place?.id) {
                        setPlace(venueData.type_of_place.id.toString());
                  } else if (typeof venueData.type_of_place === 'string') {
                        // Find place by name if it's a string
                        const foundPlace = places?.find(p => p.name === venueData.type_of_place);
                        setPlace(foundPlace?.id?.toString() || "");
                  } else if (typeof venueData.type_of_place === 'number') {
                        setPlace(venueData.type_of_place.toString());
                  }

                  // Set scavenger hunts
                  if (venueData.scavenger_hunts && Array.isArray(venueData.scavenger_hunts)) {
                        setScavengerHunts(venueData.scavenger_hunts.map(hunt => ({
                              id: hunt.id || Date.now() + Math.random(),
                              title: hunt.title || "",
                              latitude: hunt.latitude?.toString() || "",
                              longitude: hunt.longitude?.toString() || "",
                              image: null, // For new images
                              currentImage: hunt.image || null // For existing images
                        })));
                  }

                  // Set venue messages
                  if (venueData.venue_message && Array.isArray(venueData.venue_message)) {
                        setVenueMessages(venueData.venue_message.map(msg => ({
                              id: msg.id || Date.now() + Math.random(),
                              message: msg.message || ""
                        })));
                  }

                  // Set stops
                  if (venueData.stops && Array.isArray(venueData.stops)) {
                        setStops(venueData.stops.map(stop => ({
                              id: stop.id || Date.now() + Math.random(),
                              name: stop.name || "",
                              latitude: stop.latitude || "",
                              longitude: stop.longitude || ""
                        })));
                  }
            }
      }, [venueData, cities, places]);

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
            setScavengerHunts([...scavengerHunts, { id: Date.now(), title: "", image: null, latitude: "", longitude: "", currentImage: null }]);
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

      const addStop = () => {
            setStops([...stops, { id: Date.now(), name: "", latitude: "", longitude: "" }]);
      };

      const removeStop = (index) => {
            const updatedStops = stops.filter((_, i) => i !== index);
            setStops(updatedStops);
      };

      const updateStop = (index, field, value) => {
            const updatedStops = stops.map((stop, i) =>
                  i === index ? { ...stop, [field]: value } : stop
            );
            setStops(updatedStops);
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

                  // Validate city and place selections
                  const cityId = Number(city);
                  const placeId = Number(place);
                  
                  if (isNaN(cityId) || cityId <= 0) {
                        alert("Please select a valid city");
                        setLoading(false);
                        return;
                  }
                  
                  if (isNaN(placeId) || placeId <= 0) {
                        alert("Please select a valid place");
                        setLoading(false);
                        return;
                  }

                  // Check for incomplete scavenger hunts and warn user
                  const incompleteHunts = scavengerHunts.filter(hunt => {
                        if (!hunt.title || !hunt.title.trim()) return false; // Empty hunts are fine to ignore
                        if (!hunt.latitude || !hunt.latitude.trim()) return true;
                        if (!hunt.longitude || !hunt.longitude.trim()) return true;
                        
                        const lat = parseFloat(hunt.latitude.trim());
                        const lng = parseFloat(hunt.longitude.trim());
                        
                        if (isNaN(lat) || isNaN(lng)) return true;
                        if (lat < -90 || lat > 90) return true;
                        if (lng < -180 || lng > 180) return true;
                        
                        return false;
                  });

                  if (incompleteHunts.length > 0) {
                        const shouldContinue = confirm(
                              `Warning: ${incompleteHunts.length} scavenger hunt(s) have missing or invalid latitude/longitude coordinates and will not be saved. Do you want to continue?`
                        );
                        if (!shouldContinue) {
                              setLoading(false);
                              return;
                        }
                  }

                  const formData = new FormData();
                  formData.append("venue_name", venueName);
                  formData.append("latitude", latitude.toString());
                  formData.append("longitude", longitude.toString());
                  formData.append("description", description);
                  formData.append("city", Number(city).toString());
                  formData.append("type_of_place", Number(place).toString());

                  // Only append image if a new one is selected
                  if (image) {
                        formData.append("image", image);
                  }

                  // Prepare scavenger_hunts and venue_message arrays in the exact format the API expects
                  const huntsData = scavengerHunts
                        .filter(hunt => {
                              if (!hunt.title || !hunt.title.trim()) return false;
                              if (!hunt.latitude || !hunt.latitude.trim()) return false;
                              if (!hunt.longitude || !hunt.longitude.trim()) return false;
                              
                              const lat = parseFloat(hunt.latitude.trim());
                              const lng = parseFloat(hunt.longitude.trim());
                              
                              // Validate latitude and longitude ranges
                              if (isNaN(lat) || isNaN(lng)) return false;
                              if (lat < -90 || lat > 90) return false;
                              if (lng < -180 || lng > 180) return false;
                              
                              return true;
                        })
                        .map(hunt => ({
                              title: hunt.title.trim(),
                              image: hunt.image,
                              latitude: parseFloat(hunt.latitude.trim()),
                              longitude: parseFloat(hunt.longitude.trim()),
                              currentImage: hunt.currentImage
                        }));

                  const messagesData = venueMessages
                        .filter(msg => msg.message && msg.message.trim())
                        .map(msg => ({ message: msg.message.trim() }));

                  const stopsData = stops
                        .filter(stop => stop.name && stop.name.trim() && stop.latitude && stop.longitude)
                        .map(stop => ({
                              name: stop.name.trim(),
                              latitude: parseFloat(stop.latitude),
                              longitude: parseFloat(stop.longitude)
                        }));

                  // Add scavenger hunts with optional images to FormData
                  huntsData.forEach((hunt, index) => {
                        formData.append(`scavenger_hunts[${index}][title]`, hunt.title);
                        formData.append(`scavenger_hunts[${index}][latitude]`, hunt.latitude.toString());
                        formData.append(`scavenger_hunts[${index}][longitude]`, hunt.longitude.toString());
                        // Only append image if a new one is selected
                        if (hunt.image) {
                              formData.append(`scavenger_hunts[${index}][image]`, hunt.image);
                        }
                  });

                  messagesData.forEach((message, index) => {
                        formData.append(`venue_message[${index}][message]`, message.message);
                  });

                  stopsData.forEach((stop, index) => {
                        formData.append(`stops[${index}][name]`, stop.name);
                        formData.append(`stops[${index}][latitude]`, stop.latitude.toString());
                        formData.append(`stops[${index}][longitude]`, stop.longitude.toString());
                  });

                  console.log("FormData contents:");
                  for (let [key, value] of formData.entries()) {
                        console.log(key, value);
                  }

                  console.log("About to send request with the following data:");
                  console.log("- Venue Name:", venueName);
                  console.log("- Latitude:", latitude);
                  console.log("- Longitude:", longitude);
                  console.log("- Description:", description);
                  console.log("- City ID:", cityId);
                  console.log("- Place ID:", placeId);
                  console.log("- Image:", image ? "Yes" : "No");
                  console.log("- Scavenger Hunts:", huntsData.length);
                  console.log("- Venue Messages:", messagesData.length);
                  console.log("- Stops:", stopsData.length);

                  console.log("Scavenger hunts data:", huntsData);
                  console.log("Venue messages data:", messagesData);
                  console.log("Stops data:", stopsData);

                  // console.log("Scavenger hunts being sent:", huntsData);
                  // console.log("Venue messages being sent:", messagesData);
                  // console.log("Updating venue with ID:", venueData.id);

                  const res = await API.put(`/services/venues/update/${venueData.id}/`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                  });

                  // console.log("Venue updated successfully:", res.data);

                  if (onSuccess) onSuccess(res.data);
            } catch (err) {
                  console.error("Error updating venue:", err);
                  console.error("Error response data:", err.response?.data);
                  console.error("Error status:", err.response?.status);
                  console.error("Error headers:", err.response?.headers);
                  console.error("Full error object:", err);

                  // Try to extract meaningful error message from HTML response
                  let errorMessage = "Failed to update venue. Please try again.";
                  
                  if (err.response?.data && typeof err.response.data === 'string') {
                        // Try to extract error from HTML response
                        const htmlResponse = err.response.data;
                        
                        // Look for specific error patterns in the HTML
                        if (htmlResponse.includes('IntegrityError')) {
                              if (htmlResponse.includes('NOT NULL constraint failed')) {
                                    const match = htmlResponse.match(/NOT NULL constraint failed: (\w+\.\w+)/);
                                    if (match) {
                                          errorMessage = `Database error: Required field '${match[1]}' is missing.`;
                                    } else {
                                          errorMessage = "Database error: A required field is missing.";
                                    }
                              } else {
                                    errorMessage = "Database integrity error. Please check your data.";
                              }
                        } else if (htmlResponse.includes('ValidationError')) {
                              errorMessage = "Validation error. Please check your input data.";
                        } else if (htmlResponse.includes('PermissionDenied')) {
                              errorMessage = "Permission denied. You don't have access to update venues.";
                        } else if (htmlResponse.includes('DoesNotExist')) {
                              errorMessage = "Referenced object does not exist. Please check your city and place selections.";
                        }
                  } else if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
                  } else if (err.response?.data?.error) {
                        errorMessage = err.response.data.error;
                  }

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
                  {/* <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Update Venue</h2>
                        {onCancel && (
                              <button
                                    type="button"
                                    onClick={onCancel}
                                    className="text-gray-500 hover:text-gray-700"
                              >
                                    ✕
                              </button>
                        )}
                  </div> */}

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
                  {/* Stops Section - Only show if there's data */}
                  {stops.length > 0 && (
                        <div className="flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                    <label className="font-medium">Stops</label>
                                    <button
                                          type="button"
                                          onClick={addStop}
                                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                          Add Stop
                                    </button>
                              </div>

                              {stops.map((stop, index) => (
                                    <div key={index} className="border border-gray-200 rounded p-4 mb-4">
                                          <div className="flex items-center mb-3">
                                                <input
                                                      type="text"
                                                      className="border border-gray-300 rounded px-3 py-2 flex-1"
                                                      value={stop.name}
                                                      onChange={(e) => updateStop(index, 'name', e.target.value)}
                                                      placeholder="Enter stop name"
                                                />
                                                <button
                                                      type="button"
                                                      onClick={() => removeStop(index)}
                                                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                                >
                                                      Remove
                                                </button>
                                          </div>

                                          <div className="grid grid-cols-2 gap-3">
                                                <div className="flex flex-col">
                                                      <label className="mb-1 text-sm font-medium text-gray-600">
                                                            Latitude
                                                      </label>
                                                      <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                                                            value={stop.latitude}
                                                            onChange={(e) => updateStop(index, 'latitude', e.target.value)}
                                                            placeholder="Enter latitude"
                                                      />
                                                </div>
                                                <div className="flex flex-col">
                                                      <label className="mb-1 text-sm font-medium text-gray-600">
                                                            Longitude
                                                      </label>
                                                      <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                                                            value={stop.longitude}
                                                            onChange={(e) => updateStop(index, 'longitude', e.target.value)}
                                                            placeholder="Enter longitude"
                                                      />
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  )}



                  {/* Scavenger Hunts Section - Only show if there's data */}
                  {scavengerHunts.length > 0 && (
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
                                    <div key={hunt.id || index} className="border border-gray-200 rounded p-4 mb-4">
                                          <div className="flex items-center mb-3">
                                                <input
                                                      type="text"
                                                      className="border border-gray-300 rounded px-3 py-2 flex-1"
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

                                          {/* Image upload for this scavenger hunt */}
                                          <div className="flex flex-col">
                                                <label className="mb-1 text-sm font-medium text-gray-600">
                                                      Upload Image (Optional)
                                                </label>

                                                {/* Show current image if exists and no new image selected */}
                                                {hunt.currentImage && !hunt.image && (
                                                      <div className="mb-2">
                                                            <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                                            <div className="relative inline-block">
                                                                  <img
                                                                        src={hunt.currentImage}
                                                                        alt="Current scavenger hunt"
                                                                        className="h-20 w-auto border rounded"
                                                                  />
                                                                  <button
                                                                        type="button"
                                                                        onClick={() => updateScavengerHunt(index, 'currentImage', null)}
                                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                                        style={{ transform: 'translate(50%, -50%)' }}
                                                                        title="Remove current image"
                                                                  >
                                                                        ×
                                                                  </button>
                                                            </div>
                                                      </div>
                                                )}

                                                <input
                                                      type="file"
                                                      accept="image/*"
                                                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                                                      onChange={(e) => updateScavengerHunt(index, 'image', e.target.files[0])}
                                                />

                                                {/* Show new image preview */}
                                                {hunt.image && (
                                                      <div className="mt-2">
                                                            <p className="text-xs text-gray-500 mb-1">New image preview:</p>
                                                            <div className="relative inline-block">
                                                                  <img
                                                                        src={URL.createObjectURL(hunt.image)}
                                                                        alt="New scavenger hunt preview"
                                                                        className="h-20 w-auto border rounded"
                                                                  />
                                                                  <button
                                                                        type="button"
                                                                        onClick={() => updateScavengerHunt(index, 'image', null)}
                                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                                        style={{ transform: 'translate(50%, -50%)' }}
                                                                        title="Remove new image"
                                                                  >
                                                                        ×
                                                                  </button>
                                                            </div>
                                                      </div>
                                                )}

                                                <p className="text-xs text-gray-500 mt-1">
                                                      {hunt.currentImage ? "Upload new image to replace current one" : "Upload an image for this hunt"}
                                                </p>
                                          </div>
                                          
                                          {/* Latitude and Longitude inputs */}
                                          <div className="grid grid-cols-2 gap-3">
                                                <div className="flex flex-col">
                                                      <label className="mb-1 text-sm font-medium text-gray-600">
                                                            Latitude
                                                      </label>
                                                      <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                                                            value={hunt.latitude}
                                                            onChange={(e) => updateScavengerHunt(index, 'latitude', e.target.value)}
                                                            placeholder="Enter latitude"
                                                      />
                                                </div>
                                                <div className="flex flex-col">
                                                      <label className="mb-1 text-sm font-medium text-gray-600">
                                                            Longitude
                                                      </label>
                                                      <input
                                                            type="text"
                                                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                                                            value={hunt.longitude}
                                                            onChange={(e) => updateScavengerHunt(index, 'longitude', e.target.value)}
                                                            placeholder="Enter longitude"
                                                      />
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  )}

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
                              <div key={msg.id || index} className="flex items-center mb-3">
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

                  {/* Image Upload */}
                  <div className="flex flex-col">
                        <label className="mb-1 font-medium">Upload Image</label>
                        {currentImage && !image && (
                              <div className="mb-2">
                                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                                    <img
                                          src={currentImage}
                                          alt="Current venue"
                                          className="h-32 w-auto border rounded"
                                    />
                              </div>
                        )}
                        <input
                              type="file"
                              accept="image/*"
                              className="border border-gray-300 rounded px-3 py-2"
                              onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image && (
                              <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                                    <img
                                          src={URL.createObjectURL(image)}
                                          alt="preview"
                                          className="h-32 w-auto border rounded"
                                    />
                              </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                              Leave empty to keep current image
                        </p>
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="flex gap-3">
                        <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                              {loading ? "Updating..." : "Update Venue"}
                        </button>
                        {onCancel && (
                              <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                              >
                                    Cancel
                              </button>
                        )}
                  </div>
            </form>
      );
};

export default UpdateVenue;
