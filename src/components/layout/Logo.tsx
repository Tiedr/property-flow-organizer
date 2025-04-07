
import { useNavigate } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo = ({
  size = "md"
}: LogoProps) => {
  const navigate = useNavigate();
  const sizeClasses = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8"
  };

  return (
    <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
      <div className="flex items-center gap-1">
        <img 
          alt="UGHORON DB" 
          className={`object-contain ${sizeClasses[size]}`} 
          src="/lovable-uploads/2599a9a8-5e42-4df4-b098-b188c2704994.png" 
        />
        <span className={`font-bold ${size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm"} text-white`}>
          <span className="text-gradient-apple py-0 px-0 mx-0 text-xl">DB</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
