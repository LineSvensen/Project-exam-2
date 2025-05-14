import Lottie from "lottie-react";
import animation from "../../../assets/complete-loader.json";

export default function CompleteLoader({ size = 200 }) {
  return (
    <div className="flex justify-center items-center">
      <Lottie
        animationData={animation}
        loop={false}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
