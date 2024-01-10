import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [singleError, setSingleError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const PORT = 3000;

  const signup = async (username, email, password, passwordConfirm) => {
    setIsLoading(true);
    setError(null);
    setSingleError(null);

    try {
      const url = `http://3.26.96.202:${PORT}/api/v1/users/register`;


      const response = await axios.post(
        url,
        { username, email, password, passwordConfirm },
        { withCredentials: true }
      );

      if (response) {
        navigate("/checkemail");
      }
    } catch (err) {
      // Handle network or other errors;
      setIsLoading(false);
      setError(err.response.data || { error: "Unknow error" }); // Set the error state with response data or a generic message
      setSingleError(err.response.data.error.errors)
      // console.log("sign up", err.response.data);
    }
  };

  return { signup, isLoading, error,singleError };
};
