
import { useNavigate } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo = ({
  size = "md"
}: LogoProps) => {
  const navigate = useNavigate();
  
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  };
  
  return (
    <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/a6d7d39b-e6ea-4c27-a54b-eca85a3137d5.png" 
          alt="UGHORON DB" 
          className={`${sizeClasses[size]} mr-2`} 
        />
        <span className={`font-bold ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"} text-white`}>
          <span className="text-gradient-apple">DB</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
