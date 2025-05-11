export function matchesCategory(
  name,
  description,
  location,
  meta,
  tags,
  keywords
) {
  const combined = [
    name,
    description,
    location?.address,
    location?.city,
    location?.country,
    location?.continent,
    (tags || []).join(" "),
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
