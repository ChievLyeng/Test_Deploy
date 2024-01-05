import { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const ForgotPassword = () => {
  // const navigate = useNavigate();
  const { forgotpassword, isLoading, succes, error } = useForgotPassword();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    await forgotpassword(email);
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
    <Container>
      <Card sx={{ minWidth: 275, marginTop: "60px" }}>
        <CardContent>
          <Box sx={{ maxWidth: "400px", margin: "auto" }}>
            <Typography
              variant="h4"
              className="title"
              sx={{ fontWeight: "bold", marginBottom: "8px" }}
            >
              Forgot Password
            </Typography>
            <Typography
              className="title"
              color="text.secondary"
              sx={{ textAlign: "left", paddingBottom: "24px" }}
            >
              Please enter your email you use to sign in
            </Typography>

            <TextField
              fullWidth
              error={error && !email}
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              // helperText={!email ? "Please enter your email" : null}
              variant="outlined"
            />

            {error && (
              <Alert severity="error" sx={{ marginTop: "8px" }}>
                {" "}
                {error?.message}{" "}
              </Alert>
            )}

            {showSuccessAlert && (
              <Alert
                sx={{ marginTop: "16px" }}
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
              >
                <AlertTitle>Success</AlertTitle>
                Reset Link is sent to your email. Please check your email. —{" "}
                <strong>check it out!</strong>
              </Alert>
            )}

            <LoadingButton
              onClick={handleForgotPassword}
              loading={isLoading}
              loadingIndicator="Loading…"
              size="large"
              variant="contained"
              fullWidth
              sx={{ margin: "24px 0" }}
            >
              <span>Request Reset link</span>
            </LoadingButton>
            <Link to="/login">
              <Button variant="text" fullWidth>
                Back to login
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
