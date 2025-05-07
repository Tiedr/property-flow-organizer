
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to estates page instead of dashboard
    navigate("/estates");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-estate-background">
      <p className="text-white text-xl">Redirecting to estates...</p>
    </div>
  );
};

export default Index;
