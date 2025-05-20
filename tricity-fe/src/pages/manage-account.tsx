import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
}

const initialProfile: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  username: "johndoe123",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
};

const ManagePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange =
    (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = () => {
    setIsSaving(true);

    // Simulate async save operation, replace with API call
    setTimeout(() => {
      alert("Profile saved successfully!");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Update Profile
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="First Name"
            value={profile.firstName}
            onChange={handleChange("firstName")}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={profile.lastName}
            onChange={handleChange("lastName")}
            fullWidth
          />
          <TextField
            label="Username"
            value={profile.username}
            onChange={handleChange("username")}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={profile.email}
            onChange={handleChange("email")}
            fullWidth
          />
          <TextField
            label="Phone"
            value={profile.phone}
            onChange={handleChange("phone")}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ManagePage;
