import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import backendApi from "../../utils/axios-instance";

const withAuthProtection = (WrappedComponent: React.ComponentType) => {
  return function ProtectedComponent() {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      backendApi
        .get("/api/auth/status", { withCredentials: true })
        .then((res) => {
          setAuthorized(res.data?.loggedIn || false);
        })
        .catch((err) => {
          console.error("Auth status error:", err);
          setAuthorized(false);
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading)
      return (
        <Backdrop open={true} sx={{ color: "#fff", zIndex: 9999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );

    if (!authorized) {
      window.location.href = "/login";
      return null;
    }

    return <WrappedComponent />;
  };
};

export default withAuthProtection;
