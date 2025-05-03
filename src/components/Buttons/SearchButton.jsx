export default function SearchButton({ disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="px-4 py-2 button-primary  font-bold font-inter text-white rounded cursor-pointer"
    >
      Search
    </button>
  );
}
