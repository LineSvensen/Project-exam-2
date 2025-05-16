export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="warning-text">{message}</p>;
}
