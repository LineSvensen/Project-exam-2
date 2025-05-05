import { useEffect, useState } from "react";

export default function CompleteProfileWarning({
  isComplete,
  onCompleteClick,
}) {
  const [ignored, setIgnored] = useState(false);

  useEffect(() => {
    const hasIgnored =
      localStorage.getItem("holidaze_profile_ignore") === "true";
    setIgnored(hasIgnored);
  }, []);

  const handleIgnore = () => {
    localStorage.setItem("holidaze_profile_ignore", "true");
    setIgnored(true);
  };

  if (isComplete || ignored) return null;

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm mb-6">
      <h2 className="font-semibold mb-1">Complete your profile</h2>
      <p className="text-sm text-gray-600 mb-4">
        Complete your profile to use the information for your next booking and
        to gain more customers as a Venue Manager.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCompleteClick}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Complete now
        </button>
        <button
          onClick={handleIgnore}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
        >
          Ignore
        </button>
      </div>
    </div>
  );
}
