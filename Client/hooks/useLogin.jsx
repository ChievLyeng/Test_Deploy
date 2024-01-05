import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const PORT = 3000;

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `http://localhost:${PORT}/api/v1/users/login`;

      const response = await axios.post(url, {email, password}, { withCredentials: true });

      if (response) {
        // Request was successful
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });
      }
    } catch (err) {
      // Handle network or other errors;
      setIsLoading(false);
      setError(err.response ? err.response.data : "An error occurred"); // Set the error state with response data or a generic message
    }
  };

  return { login, isLoading, error };
};
