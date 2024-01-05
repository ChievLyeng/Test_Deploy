import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import {
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Book, Visibility, VisibilityOff } from "@mui/icons-material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        TECH TITAN
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUserName] = useState("");
  const [shownewPassword, setShowNewPassword] = useState(false);
  const [showconPassword, setShowConPassword] = useState(false);
  const { signup, error, isLoading, singleError } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(username, email, password, passwordConfirm);
  };

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConPassword = () => setShowConPassword((show) => !show);

  const handleMouseDownConPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              width: "80px",
              height: "80px",
              bgcolor: "primary.main",
            }}
          ></Avatar>

          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  error={Boolean(singleError?.userName && !username)}
                  autoComplete="given-name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  autoFocus
                  onChange={(e) => setUserName(e.target.value)}
                />
                {!username && singleError?.userName && (
                  <Alert severity="error" sx={{ marginTop: "8px" }}>
                    {" "}
                    {singleError?.userName?.message}{" "}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(singleError?.email && !email)}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {singleError?.email && (
                  <Alert severity="error" sx={{ marginTop: "8px" }}>
                    {" "}
                    {singleError?.email?.message}{" "}
                  </Alert>
                )}

                {error?.error?.code === 11000 && (
                  <Alert severity="error" sx={{ marginTop: "8px" }}>
                    Your email is already in use. Please use another one.
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  error={singleError?.password}
                  fullWidth
                  variant="outlined"
                  sx={{
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
                    Password
                  </InputLabel>
                  <OutlinedInput
                    // error={singleError?.password}
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
                    label="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <FormHelperText id="outlined-adornment-password-helper-text">
                    *Required
                  </FormHelperText>
                  {singleError?.password && (
                    <Alert severity="error" sx={{ marginTop: "8px" }}>
                      {" "}
                      {singleError.password?.message}{" "}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  error={singleError?.passwordConfirm}
                  fullWidth
                  variant="outlined"
                  sx={{
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
                    // error={singleError?.passwordConfirm}
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
                    *Required
                  </FormHelperText>
                  {singleError?.passwordConfirm?.message && (
                    <Alert severity="error" sx={{ marginTop: "8px" }}>
                      {" "}
                      {singleError?.passwordConfirm?.message}{" "}
                    </Alert>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <LoadingButton
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
              variant="contained"
              type="submit"
              fullWidth
            >
              <span>Sign up</span>
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
