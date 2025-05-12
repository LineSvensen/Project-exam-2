export default function SearchButton({ disabled = false }) {
  return (
    <button type="submit" disabled={disabled} className="button-primary">
      Search
    </button>
  );
}
