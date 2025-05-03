export default function ImageGallery({
  media = [],
  altFallback = "Venue image",
}) {
  if (!Array.isArray(media) || media.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
      {media.map((img, index) => (
        <img
          key={index}
          src={img.url}
          alt={img.alt || altFallback}
          className="w-full h-48 object-cover rounded"
        />
      ))}
    </div>
  );
}
