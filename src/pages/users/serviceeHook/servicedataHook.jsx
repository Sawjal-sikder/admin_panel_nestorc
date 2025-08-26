import React, { useEffect, useState } from 'react'
import API from '../../../services/api'

const servicedataHook = () => {
      const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            const fetchdata = async () => {
                  try {
                        const response = await API.get("/services/venues/");
                        setData(response.data);
                  } catch (err) {
                        setError(err);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchdata();
      }, []);

      return { data, loading, error };
};

export default servicedataHook
