import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  label = "BACK",
  className = "",
  fallback = null,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (fallback) {
      navigate(fallback);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 py-4 mb-4 text-sm text-gray-900 hover:text-gray-600 cursor-pointer font-poppins ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
