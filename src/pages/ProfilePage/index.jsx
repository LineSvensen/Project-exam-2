import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import UserProfileInfo from "../../components/UserProfile/UserProfileInfo";
import CompleteProfileWarning from "../../components/UserProfile/CompleteProfileWarning";
import EditProfileModal from "../../components/UserProfile/EditProfileModal";

import tripIcon from "../../assets/trip-icon.png";
import venueIcon from "../../assets/venue-icon.png";
import guestsIcon from "../../assets/guests-icon.png";

export default function ProfilePage() {
  const { user, loadUserFromStorage } = useAuthStore();
  const [showEdit, setShowEdit] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserFromStorage();
    setHasChecked(true);
  }, []);

  useEffect(() => {
    if (hasChecked && user === null) {
      navigate("/login");
    }
  }, [user, hasChecked, navigate]);

  if (!user) return <div className="p-8">Loading profile...</div>;

  const isIncomplete =
    !user?.avatar?.url ||
    !user?.bio ||
    user.bio.length < 3 ||
    !user?.venueManager;

  const isComplete = !isIncomplete;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={() => setShowEdit(true)}
          className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200"
        >
          Edit Profile
        </button>
      </div>

      <UserProfileInfo user={user} />

      <CompleteProfileWarning
        isComplete={!isIncomplete}
        onCompleteClick={() => setShowEdit(true)}
      />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <a
          href="/trips"
          className="bg-white shadow rounded p-4 hover:bg-gray-100 transition flex flex-col items-center"
        >
          <img src={tripIcon} alt="My Trips" className="w-12 h-12 mb-2" />
          <span className="font-semibold">My Trips</span>
        </a>
        <a
          href="/venues"
          className="bg-white shadow rounded p-4 hover:bg-gray-100 transition flex flex-col items-center"
        >
          <img src={venueIcon} alt="My Venues" className="w-12 h-12 mb-2" />
          <span className="font-semibold">My Venues</span>
        </a>
        <a
          href="/guests"
          className="bg-white shadow rounded p-4 hover:bg-gray-100 transition flex flex-col items-center"
        >
          <img src={guestsIcon} alt="My Guests" className="w-12 h-12 mb-2" />
          <span className="font-semibold">My Guests</span>
        </a>
      </div>

      {showEdit && <EditProfileModal onClose={() => setShowEdit(false)} />}
    </div>
  );
}
