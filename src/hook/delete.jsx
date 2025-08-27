import { useState } from "react";
import API from "../services/api";

const useDelete = (endpoint) => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [success, setSuccess] = useState(false);

      const handleDelete = async (id) => {
            setLoading(true);
            setError(null);
            setSuccess(false);

            try {
                  await API.delete(`${endpoint}/${id}/`);
                  setSuccess(true);
            } catch (err) {
                  setError(err.response?.data || "Something went wrong");
            } finally {
                  setLoading(false);
            }
      };

      return { handleDelete, loading, error, success };
};

export default useDelete;
