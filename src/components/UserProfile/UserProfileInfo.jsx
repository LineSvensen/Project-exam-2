import Avatar from "../Shared/Avatar";
import { useProfile } from "../../hooks/useProfile";

export default function UserProfileInfo({ user }) {
  const { profile, loading, error } = useProfile();
  const hasVenues = profile?._count?.venues > 0;
  const isRegisteredVenueManager = profile?.venueManager;

  if (loading) return <p className="p-4">Loading profile info...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!profile) return null;

  return (
    <div className="bg-white shadow rounded p-4">
      <Avatar url={profile.avatar?.url} size="w-28 h-28" />
      <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
      <p className="text-gray-600 mb-2">{profile.email}</p>

      <div className="mt-4 space-y-1 text-sm">
        <p>
          <strong>Bio:</strong>{" "}
          {profile.bio || <span className="text-gray-500">Not provided</span>}
        </p>

        {(isRegisteredVenueManager || hasVenues) && (
          <p>
            <strong>Venue Manager</strong> — managing{" "}
            <strong>{profile._count?.venues || 0}</strong>{" "}
            {profile._count?.venues === 1 ? "venue" : "venues"}.
          </p>
        )}
      </div>
    </div>
  );
}
