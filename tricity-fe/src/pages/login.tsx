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
import { Email, Lock, Business } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import backendApi from "../utils/axios-instance";
// import loginIllustration from "../assets/background-auth-img.jpg"; // optional

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
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  display: "flex",
  placeItems: "center",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
}));

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    organizationId: "",
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
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.organizationId.trim())
      newErrors.organizationId = "Organization ID is required";

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
      const response = await backendApi.post(
        "/api/auth/login",
        {
          username: formData.username,
          password: formData.password,
          organizationId: formData.organizationId,
        },
        {
          withCredentials: true, // Send cookies with the request
        }
      );

      setSnackbarSeverity("success");
      setSnackbarMessage(response.data.message || "Login successful!");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const message = (error as any)?.response?.data?.message || "Login failed";
      setSnackbarSeverity("error");
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  };

  return (
    <FullPage container>
      <Grid order={2} item xs={12} md={5}>
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
            🔐 Welcome Back
          </Typography>

          <form noValidate onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="standard"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
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
              label="Organization ID"
              name="organizationId"
              value={formData.organizationId}
              onChange={handleChange}
              error={!!errors.organizationId}
              helperText={errors.organizationId}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
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
              Log In
            </SubmitButton>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don’t have an account?{" "}
                <Button onClick={() => navigate("/signup")} size="small">
                  Sign up
                </Button>
              </Typography>
              <Typography variant="body2" mt={1}>
                <Button
                  onClick={() => navigate("/forgot-password")}
                  size="small"
                >
                  Forgot password?
                </Button>
              </Typography>
            </Box>
          </form>
        </LeftPanel>
      </Grid>

      <Grid
        order={1}
        item
        xs={false}
        md={7}
        display={{ xs: "none", md: "block" }}
      >
        <RightPanel>
          {/* Optional: Add an image or illustration here */}
        </RightPanel>
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

export default LoginPage;
