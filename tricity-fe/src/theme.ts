import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#818CF8", // primary-400
      main: "#6366F1", // primary-500 (Electric Indigo main)
      dark: "#4338CA", // primary-700
      contrastText: "#fff",
    },
    secondary: {
      light: "#6EE7B7", // secondary-300
      main: "#10B981", // secondary-500 (Teal Green main)
      dark: "#047857", // secondary-700
      contrastText: "#fff",
    },
    text: {
      primary: "#111827", // text-primary
      secondary: "#4B5563", // text-secondary
      disabled: "#9CA3AF", // text-muted
      // inverse is not directly mapped here — use in styles as needed
    },
    success: {
      main: "#22C55E", // success-main
    },
    warning: {
      main: "#F59E0B", // warning-main
    },
    info: {
      main: "#0EA5E9", // info-main
    },
    error: {
      main: "#EF4444", // danger-main (MUI uses error instead of danger)
    },
  },
});

export default theme;
