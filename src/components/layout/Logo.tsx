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
    md: "h-8",
    lg: "h-10"
  };
  return <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
      <div className="flex items-center">
        <img alt="UGHORON DB" className="object-contain" src="/lovable-uploads/2599a9a8-5e42-4df4-b098-b188c2704994.png" />
        <span className={`font-bold ${size === "lg" ? "text-xl" : size === "md" ? "text-lg" : "text-base"} text-white`}>
          <span className="text-gradient-apple py-0 px-0 mx-0 my-[45px] text-xl">DB</span>
        </span>
      </div>
    </div>;
};
export default Logo;