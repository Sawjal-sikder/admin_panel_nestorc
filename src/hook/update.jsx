import { useState } from "react";
import API from "../services/api"; // Your axios or fetch wrapper

const useUpdate = (initialData = null) => {
      const [data, setData] = useState(initialData);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      // update function
      const updateData = async (url, payload) => {
            setLoading(true);
            setError(null);

            try {
                  let dataToSend = payload;
                  let headers = {};

                  if (Object.values(payload).some((v) => v instanceof File || v instanceof Blob)) {
                        const formData = new FormData();
                        for (const key in payload) {
                              formData.append(key, payload[key]);
                        }
                        dataToSend = formData;
                        // Don't set Content-Type for FormData - let Axios set it with boundary
                  } else {
                        headers["Content-Type"] = "application/json";
                  }

                  const response = await API.put(url, dataToSend, { headers });
                  setData(response.data);
                  setLoading(false);
                  return response.data;
            } catch (err) {
                  setError(err.response?.data || err.message);
                  setLoading(false);
                  throw err;
            }
      };

      return { data, loading, error, updateData };
};

export default useUpdate;
