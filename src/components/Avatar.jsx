import defaultAvatar from "../assets/default-avatar.png";

export default function Avatar({
  url,
  alt = "User avatar",
  size = "w-12 h-12",
  className = "",
}) {
  const fallback = defaultAvatar;

  return (
    <img
      src={url || fallback}
      alt={alt}
      className={`rounded-full object-cover border border-gray-300 ${size} ${className}`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
    />
  );
}
