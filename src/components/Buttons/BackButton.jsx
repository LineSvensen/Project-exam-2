import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "BACK", className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 p-4 text-sm text-gray-900  hover:text-gray-600 cursor-pointer font-poppins ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
