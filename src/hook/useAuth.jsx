import { useState, useEffect } from "react";

export const useAuth = () => {
      const [user, setUser] = useState(null);
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [loading, setLoading] = useState(true);

      const login = (userData) => {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userData));
      };

      useEffect(() => {
            const userString = localStorage.getItem("user");

            if (userString && userString !== "undefined") {
                  try {
                        const parsedUser = JSON.parse(userString);
                        setUser(parsedUser);
                        setIsAuthenticated(true);
                  } catch {
                        setUser(null);
                        setIsAuthenticated(false);
                  }
            } else {
                  setUser(null);
                  setIsAuthenticated(false);
            }

            setLoading(false);
      }, []);

      return { user, isAuthenticated, loading, login };
};
