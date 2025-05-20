import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  People,
  Home,
  Business,
  HelpOutline,
  ContactMail,
  ManageAccounts,
  Email,
  Phone,
  Call,
  Inventory,
} from "@mui/icons-material";
import { useTheme, styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import backendApi from "../../utils/axios-instance";
import logo from "../../assets/logo.png";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: `-${drawerWidth}px`,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 0,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  // User menu state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);

  // Contact dialog open state
  const [contactOpen, setContactOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleContactOpen = () => setContactOpen(true);
  const handleContactClose = () => setContactOpen(false);

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await backendApi.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // Form state (optional, can be enhanced with form libraries)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to API)
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
    handleContactClose();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            edge="start"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={logo}
              alt="Tricity Research Logo"
              sx={{
                height: 70,
                backgroundColor: "white",
                borderRadius: 1,
                px: 1,
              }}
            />
          </Box>

          <Tooltip title="Help">
            <IconButton
              component={Link}
              to="/dashboard/help"
              color="inherit"
              sx={{ mr: 1 }}
            >
              <HelpOutline />
            </IconButton>
          </Tooltip>

          <Tooltip title="Contact Us">
            <IconButton
              color="inherit"
              sx={{ mr: 2 }}
              onClick={handleContactOpen}
            >
              <ContactMail />
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={handleUserMenuClick}
            color="inherit"
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar alt="User Name">U</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 150 },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor:
              theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItemButton
            component={RouterLink}
            to="/dashboard/mri"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Check MRI" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/dashboard/users"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/dashboard/organizations"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary="Manage Organizations" />
          </ListItemButton>
          <ListItemButton
            component={RouterLink}
            to="/dashboard/manage"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <ManageAccounts />
            </ListItemIcon>
            <ListItemText primary="Manage" />
          </ListItemButton>

          <ListItemButton
            component={RouterLink}
            to="/dashboard/data"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Manage Data" />
          </ListItemButton>
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />

        <Outlet />
      </Main>

      {/* Contact Us Dialog */}
      <Dialog
        open={contactOpen}
        onClose={handleContactClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Contact Us</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mb={2}>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Email color="primary" /> Email:{" "}
              <MuiLink href="mailto:support@example.com">
                support@example.com
              </MuiLink>
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Phone color="primary" /> Phone: +1-800-123-4567
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Call color="primary" /> Helpline: +1-800-765-4321
            </Typography>
          </Stack>

          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={form.message}
              onChange={handleFormChange}
              multiline
              rows={4}
              margin="normal"
              required
            />
            <DialogActions sx={{ px: 0 }}>
              <Button type="submit" variant="contained" color="primary">
                Send Message
              </Button>
              <Button onClick={handleContactClose}>Cancel</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DashboardLayout;
