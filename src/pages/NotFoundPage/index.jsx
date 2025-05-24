// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import notFoundImg from "../../assets/404.png";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 Not Found | Holidaze";
  }, []);

  return (
    <div className="mt-16 flex flex-col items-center justify-center px-4 bg-white text-center">
      <img
        src={notFoundImg}
        alt="404 illustration artist:flaticon.com/kerismaker"
        className="w-72 mb-8"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Oops!</h1>
      <p className="text-gray-500 mb-6">
        Something went wrong or page have been removed :/
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 button-cancel-ignore transition"
      >
        Go back home
      </Link>
    </div>
  );
}
