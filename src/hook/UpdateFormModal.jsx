import React, { useState, useEffect } from "react";
import useUpdate from "./update";

const UpdateFormModal = ({
      isOpen,
      onClose,
      onUpdated,
      endpoint,
      fields,
      title = "Update Item",
      data: initialData,
}) => {
      // ✅ Use validated endpoint
      const validEndpoint = endpoint && typeof endpoint === "string" ? endpoint : null;
      const { data: updatedData, loading, error, success, updateData } = useUpdate(validEndpoint);

      const [formData, setFormData] = useState({});
      const [localError, setLocalError] = useState(null);

      useEffect(() => {
            if (isOpen && initialData) {
                  const initialState = fields.reduce((acc, field) => {
                        if (field.type === "array") {
                              acc[field.name] = initialData[field.name] || [{}];
                        } else if (field.type === "boolean") {
                              acc[field.name] = initialData[field.name] ?? false;
                        } else {
                              acc[field.name] = initialData[field.name] ?? "";
                        }
                        return acc;
                  }, {});

                  fields.forEach(f => {
                        if (!(f.name in initialState)) {
                              if (f.type === "array") initialState[f.name] = [{}];
                              else if (f.type === "boolean") initialState[f.name] = false;
                              else initialState[f.name] = "";
                        }
                  });

                  setFormData(initialState);
            }
      }, [isOpen, fields, initialData]);

      if (!isOpen) return null;

      const handleChange = (e, arrayName, index) => {
            if (arrayName !== undefined) {
                  const updatedArray = [...formData[arrayName]];
                  updatedArray[index][e.target.name] = e.target.value;
                  setFormData({ ...formData, [arrayName]: updatedArray });
            } else {
                  setFormData({ ...formData, [e.target.name]: e.target.value });
            }
      };

      const addArrayItem = (arrayName, defaultItem = {}) => {
            setFormData({
                  ...formData,
                  [arrayName]: [...formData[arrayName], defaultItem],
            });
      };

      const removeArrayItem = (arrayName, index) => {
            const updatedArray = [...formData[arrayName]];
            updatedArray.splice(index, 1);
            setFormData({ ...formData, [arrayName]: updatedArray });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLocalError(null);

            if (!validEndpoint) {
                  setLocalError("Configuration error: Invalid endpoint provided");
                  return;
            }

            try {
                  const updated = await updateData(formData);
                  onClose();
                  if (onUpdated) onUpdated(updated);
            } catch (err) {
                  console.error("Error updating item:", err);
                  setLocalError("Failed to update item. Please try again.");
            }
      };

      return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-2xl text-center text-gray-600 font-semibold mb-6">{title}</h2>

                        {loading && <p className="text-blue-600 mb-2">Saving...</p>}
                        {(error || localError) && (
                              <p className="text-red-600 mb-2">{localError || JSON.stringify(error)}</p>
                        )}
                        {success && <p className="text-green-600 mb-2">Updated successfully!</p>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                              {fields.map((field, idx) => (
                                    <div key={idx}>
                                          <label className="block text-md my-1 font-medium">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                          </label>

                                          {field.type === "textarea" ? (
                                                <textarea
                                                      name={field.name}
                                                      value={formData[field.name] || ""}
                                                      onChange={handleChange}
                                                      rows={field.rows || 4}
                                                      placeholder={field.placeholder}
                                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                      required={field.required}
                                                />
                                          ) : field.type === "array" ? (
                                                <>
                                                      {formData[field.name]?.map((item, index) => (
                                                            <div key={index} className="flex gap-2 my-2 items-center">
                                                                  {field.fields.map((subField, subIdx) => (
                                                                        <input
                                                                              key={subIdx}
                                                                              type={subField.type || "text"}
                                                                              name={subField.name}
                                                                              value={item[subField.name] || ""}
                                                                              step={subField.step || undefined}
                                                                              placeholder={subField.placeholder}
                                                                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                                              required={subField.required}
                                                                              onChange={(e) => handleChange(e, field.name, index)}
                                                                        />
                                                                  ))}
                                                                  <button
                                                                        type="button"
                                                                        onClick={() => removeArrayItem(field.name, index)}
                                                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                                  >
                                                                        ✕
                                                                  </button>
                                                            </div>
                                                      ))}
                                                      <button
                                                            type="button"
                                                            onClick={() =>
                                                                  addArrayItem(
                                                                        field.name,
                                                                        field.fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
                                                                  )
                                                            }
                                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                                                      >
                                                            Add {field.label}
                                                      </button>
                                                </>
                                          ) : field.type === "boolean" ? (
                                                <div className="flex items-center gap-2 mt-2">
                                                      <input
                                                            type="checkbox"
                                                            name={field.name}
                                                            checked={!!formData[field.name]}
                                                            onChange={(e) =>
                                                                  setFormData({ ...formData, [field.name]: e.target.checked })
                                                            }
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                      />
                                                      <span className="text-sm text-gray-700">{field.placeholder}</span>
                                                </div>
                                          ) : (
                                                <input
                                                      type={field.type || "text"}
                                                      name={field.name}
                                                      value={formData[field.name] || ""}
                                                      onChange={handleChange}
                                                      placeholder={field.placeholder}
                                                      step={field.step || undefined}
                                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                      required={field.required}
                                                />
                                          )}
                                    </div>
                              ))}

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
                                          {loading ? "Saving..." : "Save"}
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default UpdateFormModal;
