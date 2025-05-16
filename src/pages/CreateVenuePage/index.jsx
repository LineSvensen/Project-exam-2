import VenueForm from "../../components/Venue/VenueForm";
import BackButton from "../../components/Buttons/BackButton";

export default function CreateVenuePage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Create New Venue</h1>
      <VenueForm mode="create" />
    </div>
  );
}
