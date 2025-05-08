import VenueForm from "../../components/Venue/VenueForm";

export default function CreateVenuePage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Venue</h1>
      <VenueForm mode="create" />
    </div>
  );
}
