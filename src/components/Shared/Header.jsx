import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import Avatar from "./Avatar";
import logo from "../../assets/holidaze-logo-bg.png";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import useFilterStore from "../../stores/filterStore";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const resetAll = useFilterStore((state) => state.resetAll);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate(user ? "/profile" : "/login");
    setMenuOpen(false);
  };
  const handleResetAndNavigateHome = () => {
    resetAll(); // clear filters
    setSort("featured");
    sessionStorage.removeItem("scrollY");
    navigate("/?page=1", { replace: true }); // go home & reset pagination
    setMenuOpen(false);
  };

  return (
    <header className="p-4 bg-white shadow relative z-50">
      <div className="max-w-6xl xl:px-8 mx-auto flex justify-between items-center px-4">
        <Link to="/" onClick={handleResetAndNavigateHome}>
          <img src={logo} className="max-h-14" alt="Holidaze logo" />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            onClick={handleResetAndNavigateHome}
            className="hover:underline"
          >
            Home
          </Link>

          <Link to="/favourites" className="hover:underline">
            <span className="text-xl cursor-pointer">
              <FaRegHeart />
            </span>
          </Link>

          <button
            onClick={handleProfileClick}
            className="focus:outline-none cursor-pointer"
          >
            {user ? (
              <Avatar url={user.avatar?.url} size="w-8 h-8" />
            ) : (
              <FaUserCircle className="text-2xl" />
            )}
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="text-black hover:underline cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        {/* Burger icon */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={handleProfileClick} aria-label="Profile">
            {user ? (
              <Avatar url={user.avatar?.url} size="w-8 h-8" />
            ) : (
              <FaUserCircle className="text-2xl" />
            )}
          </button>

          <button
            className="text-black cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-teal-800 text-white flex flex-col items-start p-6 space-y-6 text-sm md:hidden">
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-white cursor-pointer"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col items-start space-y-1 border-b border-white pb-4 w-full">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2"
            >
              {user ? (
                <Avatar url={user.avatar?.url} size="w-12 h-12" />
              ) : (
                <FaUserCircle className="text-3xl" />
              )}
              <span className="text-white text-base font-semibold">
                {user ? user.name : "Login"}
              </span>
            </button>
          </div>

          <Link
            to="/"
            onClick={toggleMenu}
            className="hover:underline font-bold"
          >
            Home
          </Link>
          <Link
            to="/profile"
            onClick={toggleMenu}
            className="hover:underline font-bold"
          >
            My Profile
          </Link>

          {user && (
            <>
              <Link
                to="/trips"
                onClick={toggleMenu}
                className="ml-4 hover:underline"
              >
                My Trips
              </Link>
              <Link
                to="/venues"
                onClick={toggleMenu}
                className="ml-4 hover:underline"
              >
                My Venues
              </Link>
              <Link
                to="/guests"
                onClick={toggleMenu}
                className="ml-4 hover:underline"
              >
                My Guests
              </Link>
              <Link
                to="/favourites"
                onClick={toggleMenu}
                className="hover:underline font-bold"
              >
                My Favourites
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline font-bold cursor-pointer"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="hover:underline font-bold"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
