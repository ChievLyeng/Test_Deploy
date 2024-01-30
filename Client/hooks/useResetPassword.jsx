import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useResetPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [succes, setSuccess] = useState(false);
  const [singleError, setSingleError] = useState(null);
  // const { navigate } = useNavigate();
  //   const { dispatch } = useAuthContext();
  const PORT = 3000;

  const resetpassword = async (password, passwordConfirm, token) => {
    setIsLoading(true);
    setSuccess(false);
    setError(null);
    setSingleError(null);

    try {
      const url = `http://3.107.17.15:${PORT}/api/v1/users/resetPassword/${token}`;
      console.log("url", url);

      const response = await axios.patch(
        url,
        { password, passwordConfirm },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoading(false);
        setSuccess(true);
      }
    } catch (err) {
      // Handle network or other errors;
      setIsLoading(false);
      setSuccess(false);
      setError(err.response ? err.response.data : "An error occurred"); // Set the error state with response data or a generic message
      setSingleError(err.response.data.error.errors);
    }
  };

  return { resetpassword, isLoading, succes, error,singleError };
};
