import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  styled,
  InputAdornment,
  Paper,
} from "@mui/material";

import Grid from "@mui/material/GridLegacy";
import { Person, Business, Email, Lock, Key } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import backendApi from "../utils/axios-instance";
import signupIllustration from "../assets/background-auth-img.jpg";

// Styled components
const FullPage = styled(Grid)({
  height: "100vh",
  overflow: "hidden",
});

const LeftPanel = styled(Paper)(({ theme }) => ({
  height: "100vh",
  overflowY: "auto",
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  boxShadow: "none",
  backgroundColor: theme.palette.background.paper,
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none", // Firefox
}));

const RightPanel = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  // background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.background.paper} 100%)`,
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  display: "flex",
  placeItems: "center",
}));

const Image = styled("img")({
  width: "70%",
  height: "70%",
  objectFit: "cover",
});

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
}));

// Component
const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    email: "",
    password: "",
    confirmPassword: "",
    signupKey: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.organization.trim())
      newErrors.organization = "Organization is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "At least 8 characters";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.signupKey.trim())
      newErrors.signupKey = "Signup key is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await backendApi.post("/api/auth/signup", formData);
      setSnackbarSeverity("success");
      setSnackbarMessage(response.data.message || "Signup successful!");
      setSnackbarOpen(true);
      localStorage.setItem("returning_user", "1");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      setSnackbarSeverity("error");
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  };

  return (
    <FullPage container>
      <Grid order={1} item xs={12} md={6}>
        <LeftPanel>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: "primary.main",
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📝 Welcome
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="standard"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              label="Organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              error={!!errors.organization}
              helperText={errors.organization}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              label="Signup Key"
              name="signupKey"
              value={formData.signupKey}
              onChange={handleChange}
              error={!!errors.signupKey}
              helperText={errors.signupKey}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Key />
                  </InputAdornment>
                ),
              }}
            />
            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign Up
            </SubmitButton>
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Button onClick={() => navigate("/login")} size="small">
                  Log in
                </Button>
              </Typography>
            </Box>
          </form>
        </LeftPanel>
      </Grid>

      <Grid
        order={2}
        item
        xs={false}
        md={6}
        display={{ xs: "none", md: "block" }}
      >
        <RightPanel></RightPanel>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </FullPage>
  );
};

export default SignupPage;
