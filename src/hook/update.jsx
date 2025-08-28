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
                  const response = await API.put(url, payload);
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
