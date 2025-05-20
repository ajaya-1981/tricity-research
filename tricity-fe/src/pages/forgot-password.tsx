import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom color="primary">
        Forgot Password
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={4}>
        Please contact your administrator to reset your password.
      </Typography>
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
