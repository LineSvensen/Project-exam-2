import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import UserProfileInfo from "../../components/UserProfile/UserProfileInfo";
import EditProfileModal from "../../components/UserProfile/EditProfileModal";

import tripIcon from "../../assets/mytrips-icon-x.png";
import venueIcon from "../../assets/myvenues-icon-x.png";

export default function ProfilePage() {
  const { user, loadUserFromStorage } = useAuthStore();
  const [showEdit, setShowEdit] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadUserFromStorage();
  }, [refreshKey]);

  useEffect(() => {
    document.title = "My Profile | Holidaze";
  }, []);

  const handleProfileUpdated = () => {
    setRefreshKey((prev) => prev + 1);
    setShowEdit(false);
  };

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

  const isUsingDefaultAvatar =
    !user?.avatar?.url || user.avatar.url.includes("default");
  const isBioTooShort = !user?.bio || user.bio.trim().length < 3;

  const isProfileComplete = !isUsingDefaultAvatar && !isBioTooShort;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button onClick={() => setShowEdit(true)} className="button-descret">
          Edit Profile
        </button>
        {showEdit && <EditProfileModal onUpdated={handleProfileUpdated} />}
      </div>

      <UserProfileInfo user={user} key={refreshKey} />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
        <a
          href="/trips"
          className="bg-white shadow rounded p-4 hover:bg-gray-100 transition flex flex-col items-center "
        >
          <img src={tripIcon} alt="My Trips" className="w-12 h-12 mb-2" />
          <span className="">My Trips</span>
        </a>
        <a
          href="/venues"
          className="bg-white shadow rounded p-4 hover:bg-gray-100 transition flex flex-col items-center"
        >
          <img src={venueIcon} alt="My Venues" className="w-12 h-12 mb-2" />
          <span className="">My Venues</span>
        </a>
      </div>

      {showEdit && (
        <EditProfileModal
          onClose={() => setShowEdit(false)}
          onUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
}
