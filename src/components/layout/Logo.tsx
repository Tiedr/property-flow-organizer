
import { useNavigate } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo = ({
  size = "md"
}: LogoProps) => {
  const navigate = useNavigate();
  const sizeClasses = {
    sm: "h-6",
    md: "h-9", 
    lg: "h-11"
  };

  return (
    <div 
      className="flex items-center justify-center cursor-pointer" 
      onClick={() => navigate("/")}
    >
      <div className="flex items-center justify-center w-full">
        <img 
          alt="UGHORON" 
          className={`object-contain ${sizeClasses[size]}`} 
          src="/lovable-uploads/2599a9a8-5e42-4df4-b098-b188c2704994.png" 
        />
      </div>
    </div>
  );
};

export default Logo;
