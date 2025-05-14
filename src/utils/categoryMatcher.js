export function matchesCategory(
  name,
  description,
  location,
  meta,
  tags,
  keywords
) {
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return false; // Prevents `.some()` on undefined or non-array
  }

  const combined = [
    name,
    description,
    location?.address,
    location?.city,
    location?.country,
    location?.continent,
    Array.isArray(tags) ? tags.join(" ") : "",
    JSON.stringify(meta),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) => {
    const parts = keyword.toLowerCase().split("+");
    return parts.every((part) => combined.includes(part));
  });
}
