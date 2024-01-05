import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../components/Layout";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Homepage = () => {
  const [data, setData] = useState();
  const user = useAuthContext();
  const token = user.user?.token || "";

  // console.log("aaaa",token)
  // console.log(typeof(token))

  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/users`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data.users);
      const userData = response.data?.data?.users || [];
      console.log(userData);
      setData(userData);

      return response.data.data.users;
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  console.log("dataaaa", data);

  return (
    <Layout>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                User List
              </Typography>
              {/* <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                Something short and leading about the collection below—its
                contents, the creator, etc. Make it short and sweet, but not too
                short so folks don&apos;t simply skip over it entirely.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="contained">Main call to action</Button>
                <Button variant="outlined">Secondary action</Button>
              </Stack> */}
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {data &&
                data.map((user) => (
                  <Grid item key={user._id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          // 16:9
                          pt: "56.25%",
                        }}
                        image="https://source.unsplash.com/random?wallpapers"
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {user.userName}
                        </Typography>
                        <Typography>{user.email}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">View</Button>
                        <Button size="small">Edit</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Container>
        </main>

        {/* End footer */}
      </ThemeProvider>
    </Layout>
  );
};

export default Homepage;
