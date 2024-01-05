import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router-dom";
import "../style/checkEmail.css";

const CheckEmail = () => {


  return (
    <>
      
      <Box
        sx={{
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <Card
          sx={{
            marginTop: "120px",
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
        >
          <Typography
            sx={{ textAlign: "center", fontWeight: "bold" }}
            gutterBottom
            variant="h4"
            component="div"
          >
            Verify your email address
          </Typography>
          <CardMedia
            sx={{
              height: 100,
              width: 100,
              objectFit: "cover",
              margin: "16px auto",
            }}
            image="https://cdn-icons-png.flaticon.com/512/9841/9841132.png"
            title="Green Iguana"
          />

          <CardContent>
            <Typography
              sx={{ textAlign: "center", fontSize: "16px" }}
              variant="body2"
              color="text.secondary"
            >
              We have sent a verification link to your email.
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "16px",
              }}
              variant="body2"
              color="text.secondary"
            >
              Check you email and click the link to verify your account.
            </Typography>
          </CardContent>
          <div className="button-container">
            <Link to="/signup">
              <Button variant="outlined">Back to site</Button>
            </Link>
          </div>
        </Card>
      </Box>
    </>
  );
};

export default CheckEmail;
