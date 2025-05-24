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
    resetAll();
    setSort("featured");
    sessionStorage.removeItem("scrollY");
    navigate("/?page=1", { replace: true });
    setMenuOpen(false);
  };

  return (
    <header className="p-4 bg-white shadow relative z-50">
      <div className="max-w-6xl xl:px-3 lg:px-2.7 md:px-2.7 sm:px-2.7 mx-auto flex justify-between items-center px-2.7">
        <Link to="/" onClick={handleResetAndNavigateHome}>
          <img src={logo} className="max-h-14" alt="Holidaze logo" />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            onClick={handleResetAndNavigateHome}
            className=" font-poppins link-hover font-color"
          >
            HOME
          </Link>

          <Link to="/favourites" className="link-hover ">
            <span className="text-xl cursor-pointer font-color">
              <FaRegHeart />
            </span>
          </Link>

          <button
            onClick={handleProfileClick}
            className="cursor-pointer link-hover font-color"
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
              className="font-color cursor-pointer font-poppins link-hover "
            >
              LOG OUT
            </button>
          )}
        </div>

        {/* burger icon! */}
        <div className="md:hidden flex items-center space-x-4 font-color">
          <button onClick={handleProfileClick} aria-label="Profile">
            {user ? (
              <Avatar url={user.avatar?.url} size="w-8 h-8" />
            ) : (
              <FaUserCircle className="text-2xl" />
            )}
          </button>

          <button
            className="font-color cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* mobile open Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-40"
          onClick={toggleMenu}
        >
          <div
            className="w-64 h-full bg-[#006d77] text-white flex flex-col items-start p-6 space-y-6 text-sm absolute right-0 top-0 shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
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
                  <Avatar
                    url={user.avatar?.url}
                    size="w-12 h-12 cursor-pointer"
                  />
                ) : (
                  <FaUserCircle className="text-3xl cursor-pointer" />
                )}
                <span className="text-white text-base font-semibold cursor-pointer">
                  {user ? user.name : "LOG IN"}
                </span>
              </button>
            </div>

            <Link to="/" onClick={toggleMenu} className="links-m-menu ">
              HOME
            </Link>
            <Link to="/profile" onClick={toggleMenu} className="links-m-menu">
              MY PROFILE
            </Link>

            {user && (
              <>
                <Link
                  to="/trips"
                  onClick={toggleMenu}
                  className="ml-4 font-inter"
                >
                  My Trips
                </Link>
                <Link
                  to="/venues"
                  onClick={toggleMenu}
                  className="ml-4 font-inter"
                >
                  My Venues
                </Link>

                <Link
                  to="/favourites"
                  onClick={toggleMenu}
                  className="links-m-menu"
                >
                  MY FAVOURITES
                </Link>
                <button onClick={handleLogout} className="links-m-menu">
                  LOG OUT
                </button>
              </>
            )}

            {!user && (
              <Link to="/login" onClick={toggleMenu} className="links-m-menu">
                LOG IN/REGISTER
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
