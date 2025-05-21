import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const returningUser = localStorage.getItem("returning_user");
    if (returningUser === "1") {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  return null;
};

export default HomeRedirect;
