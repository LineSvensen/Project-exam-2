import { CheckCircle, AlertCircle } from "lucide-react";

export default function MessageBox({ message, type = "error" }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`mt-4 p-4 flex items-start gap-3 rounded-md border text-sm ${
        isSuccess
          ? "bg-green-50 border-green-400 text-green-700"
          : "bg-red-50 border-red-400 text-red-700"
      }`}
    >
      <span className="mt-0.5">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
      </span>
      <span>{message}</span>
    </div>
  );
}
