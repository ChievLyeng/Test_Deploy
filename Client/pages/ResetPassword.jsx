import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  IconButton,
  FormHelperText,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useResetPassword } from "../hooks/useResetPassword";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [shownewPassword, setShowNewPassword] = useState(false);
  const [showconPassword, setShowConPassword] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { resetpassword, isLoading, succes, error, singleError } =
    useResetPassword();
  const { token } = useParams();

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConPassword = () => setShowConPassword((show) => !show);

  const handleMouseDownConPassword = (event) => {
    event.preventDefault();
  };

  const handleResetpasword = async (e) => {
    e.preventDefault();
    await resetpassword(password, passwordConfirm, token);
    console.log(singleError);
    console.log(error)
  };

  useEffect(() => {
    if (succes) {
      // Show the success alert
      setShowSuccessAlert(true);

      // Automatically hide the success alert after 5 seconds (adjust as needed)
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);

      // Clear the timer when the component unmounts or when the alert is closed
      return () => clearTimeout(timer);
    }
  }, [succes]);
  return (
    <>
      <Container>
        <Card sx={{ minWidth: 275, marginTop: "60px" }}>
          <CardContent>
            <Box sx={{ maxWidth: "400px", margin: "auto" }}>
              <Typography
                variant="h4"
                className="title"
                sx={{ fontWeight: "bold", marginBottom: "8px" }}
              >
                Reset Password
              </Typography>

              <Typography
                className="title"
                color="text.secondary"
                sx={{ textAlign: "left", paddingBottom: "24px" }}
              >
                Strong passwords include numbers, letters, and punctuation
                marks.
              </Typography>

              <form onSubmit={handleResetpasword}>
                <FormControl
                  error={singleError?.password && !password}
                  fullWidth
                  variant="outlined"
                  sx={{
                    margin: "24px 0",
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        // borderColor: "#82B440",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      //   color: "#82B440",
                    },
                  }}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    New Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={shownewPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownNewPassword}
                          edge="end"
                        >
                          {shownewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <FormHelperText id="outlined-adornment-password-helper-text">
                    {singleError?.password
                      ? `${singleError?.password?.message}`
                      : "*Require"}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  error={singleError && !passwordConfirm}
                  fullWidth
                  variant="outlined"
                  sx={{
                    margin: " 0",
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        // borderColor: "black",
                      },
                    "& .MuiInputLabel-root.Mui-focused": {
                      //   color: "#82B440",
                    },
                  }}
                >
                  <InputLabel htmlFor="outlined-adornment-confirm-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-confirm-password"
                    type={showconPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConPassword}
                          onMouseDown={handleMouseDownConPassword}
                          edge="end"
                        >
                          {showconPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                    }}
                  />
                  <FormHelperText id="outlined-adornment-confirm-password-helper-text">
                    {singleError?.passwordConfirm
                      ? `${singleError?.passwordConfirm?.message}`
                      : "*Require"}
                  </FormHelperText>
                </FormControl>

                {error?.error?.statusCode === 400 && (
                    <Alert severity="error" sx={{ marginTop: "8px" }}>
                      {" "}
                      {error.message}{" "}
                    </Alert>
                  )}

                {showSuccessAlert && (
                  <Alert
                    severity="success"
                    onClose={() => setShowSuccessAlert(false)}
                  >
                    <AlertTitle>Success</AlertTitle>
                    Your password has been updated.
                    <strong>you can login now!</strong>
                  </Alert>
                )}

                <LoadingButton
                  onClick={handleResetpasword}
                  loading={isLoading}
                  loadingIndicator="Loading…"
                  size="large"
                  variant="contained"
                  fullWidth
                  sx={{ margin: "24px 0" }}
                >
                  <span>Reset password</span>
                </LoadingButton>

                <Link to="/login">
                  <Button variant="text" fullWidth>
                    Back to login
                  </Button>
                </Link>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ResetPassword;
