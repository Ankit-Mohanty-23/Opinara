import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    
    if (token) {
      localStorage.setItem("token", token);

      // Redirect to home (AuthContext will load the user)
      navigate("/home", { replace: true });
    }
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;
