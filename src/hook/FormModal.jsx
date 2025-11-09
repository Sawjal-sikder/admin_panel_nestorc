import React, { useState, useEffect } from "react";
import useApiMutation from "./Create"; // POST
import useApiUpdate from "./update";   // PUT/PATCH

const FormModal = ({
      isOpen,
      onClose,
      onSuccess,
      endpoint,
      title = "Form",
      fields,
      data = null,
      mode = "create", // "create" or "update"
}) => {
      const { createData, loading: creating, error: createError } = useApiMutation(endpoint);
      const { updateData, loading: updating, error: updateError } = useApiUpdate();

      const loading = mode === "create" ? creating : updating;
      const error = mode === "create" ? createError : updateError;

      const [formData, setFormData] = useState({});

      // Initialize form state with proper default values
      useEffect(() => {
            if (isOpen) {
                  const initialState = fields.reduce((acc, field) => {
                        if (field.type === "array") {
                              acc[field.name] = data?.[field.name]?.map(item =>
                                    field.fields.reduce(
                                          (subAcc, f) => ({ ...subAcc, [f.name]: item[f.name] ?? "" }),
                                          {}
                                    )
                              ) || [{}];
                        } else if (field.type === "boolean") {
                              acc[field.name] = data?.[field.name] ?? false;
                        } else if (field.type === "file") {
                              // Don't initialize file fields with empty string
                              acc[field.name] = data?.[field.name] ?? null;
                        } else {
                              acc[field.name] = data?.[field.name] ?? "";
                        }
                        return acc;
                  }, {});
                  setFormData(initialState);
            }
      }, [isOpen, fields, data]);

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
            try {
                  // Filter out file fields properly based on mode and file state
                  const cleanedData = Object.keys(formData).reduce((acc, key) => {
                        const field = fields.find(f => f.name === key);
                        
                        if (field?.type === "file") {
                              // For create mode: include only if file is selected
                              if (mode === "create") {
                                    if (formData[key] instanceof File) {
                                          acc[key] = formData[key];
                                    }
                                    // Skip null/undefined/string values for create
                              } else {
                                    // For update mode: include only if new file is selected
                                    if (formData[key] instanceof File) {
                                          acc[key] = formData[key];
                                    }
                                    // Skip existing URLs or null values for update
                              }
                        } else {
                              // Include non-file fields
                              acc[key] = formData[key];
                        }
                        return acc;
                  }, {});

                  let result;
                  if (mode === "create") {
                        result = await createData(cleanedData);
                  } else {
                        result = await updateData(endpoint, cleanedData);
                  }
                  if (onSuccess) onSuccess(result);
                  onClose();
            } catch (err) {
                  alert("Error:", err);
            }
      };

      return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-2xl text-center text-gray-600 font-semibold mb-6">{title}</h2>

                        {loading && <p className="text-blue-600 mb-2">Saving...</p>}
                        {error && <p className="text-red-600 mb-2">{JSON.stringify(error)}</p>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                              {fields.map((field, idx) => (
                                    <div key={idx}>
                                          <label className="block text-md my-1 font-medium">
                                                {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                                          </label>

                                          {/* Textarea */}
                                          {field.type === "textarea" ? (
                                                <textarea
                                                      name={field.name}
                                                      value={formData[field.name] ?? ""}
                                                      onChange={handleChange}
                                                      rows={field.rows || 4}
                                                      placeholder={field.placeholder}
                                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                                      required={field.required}
                                                />
                                          )

                                                /* Array fields */
                                                : field.type === "array" ? (
                                                      <>
                                                            {formData[field.name]?.map((item, index) => (
                                                                  <div key={index} className="flex gap-2 my-2 items-center">
                                                                        {field.fields.map((subField, subIdx) => (
                                                                              <input
                                                                                    key={subIdx}
                                                                                    type={subField.type || "text"}
                                                                                    name={subField.name}
                                                                                    value={item[subField.name] ?? ""}
                                                                                    step={subField.step || undefined}
                                                                                    placeholder={subField.placeholder}
                                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
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
                                                )

                                                      /* Boolean checkbox */
                                                      : field.type === "boolean" ? (
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
                                                      )

                                                            /* Select dropdown */
                                                            : field.type === "select" ? (
                                                                  <select
                                                                        name={field.name}
                                                                        value={formData[field.name] ?? ""}
                                                                        onChange={handleChange}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                                                        required={field.required}
                                                                  >
                                                                        <option value="">Select {field.label}</option>
                                                                        {field.options?.map((opt, i) => (
                                                                              <option key={i} value={opt.value}>
                                                                                    {opt.label}
                                                                              </option>
                                                                        ))}
                                                                  </select>
                                                            )

                                                                  /* Date */
                                                                  : field.type === "date" ? (
                                                                        <input
                                                                              type="date"
                                                                              name={field.name}
                                                                              value={formData[field.name] ?? ""}
                                                                              onChange={handleChange}
                                                                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                                                              required={field.required}
                                                                        />
                                                                  )

                                                                        /* File */
                                                                        : field.type === "file" ? (
                                                                              <div>
                                                                                    <input
                                                                                          type="file"
                                                                                          name={field.name}
                                                                                          onChange={(e) => {
                                                                                                // Set the file or null if no file selected
                                                                                                const file = e.target.files[0] || null;
                                                                                                setFormData({ ...formData, [field.name]: file });
                                                                                          }}
                                                                                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                                                                          required={field.required && mode === "create"}
                                                                                    />
                                                                                    {mode === "update" && data?.[field.name] && typeof data[field.name] === "string" && (
                                                                                          <p className="text-sm text-gray-500 mt-1">
                                                                                                Current: {data[field.name].split('/').pop()}
                                                                                          </p>
                                                                                    )}
                                                                              </div>
                                                                        )

                                                                              /* Default text/number/email */
                                                                              : (
                                                                                    <input
                                                                                          type={field.type || "text"}
                                                                                          name={field.name}
                                                                                          value={formData[field.name] ?? ""}
                                                                                          onChange={handleChange}
                                                                                          placeholder={field.placeholder}
                                                                                          step={field.step || undefined}
                                                                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
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
                                          className={`px-4 py-2 text-white rounded ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                                    >
                                          {loading ? "Saving..." : "Save"}
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default FormModal;
