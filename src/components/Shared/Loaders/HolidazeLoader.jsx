import Lottie from "lottie-react";
import animationData from "../../../assets/redhouse.json"; 

export default function HolidazeLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <Lottie animationData={animationData} loop={true} className="w-52 h-52" />
      <p className="text-lg  font-medium text-teal-700">
        Unlock the holiday of your dreams...
      </p>
    </div>
  );
}
