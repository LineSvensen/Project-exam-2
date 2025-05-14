// src/components/Loaders/PublishedLoader.jsx
import Lottie from "lottie-react";
import animationData from "../../../assets/published-loader.json";

export default function PublishedLoader() {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Lottie animationData={animationData} loop={false} />
    </div>
  );
}
