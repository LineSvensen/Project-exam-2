import Avatar from "../Avatar";

export default function UserProfileInfo({ user }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <Avatar url={user.avatar?.url} size="w-28 h-28" />
      <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
      <p className="text-gray-600 mb-2">{user.email}</p>

      <div className="mt-4  space-y-1 text-sm">
        <p>
          <strong>Bio:</strong>{" "}
          {user.bio || <span className="text-gray-500">Not provided</span>}
        </p>

        <p>
          <strong>Venue Manager:</strong>{" "}
          {user.venueManager ? (
            "Yes"
          ) : (
            <span className="text-gray-500">No</span>
          )}
        </p>
      </div>
    </div>
  );
}
