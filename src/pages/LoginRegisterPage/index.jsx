// pages/LoginRegisterPage/index.jsx
import LoginRegisterForm from "../../components/LoginRegisterForm";
import BackButton from "../../components/Buttons/BackButton";

export default function LoginRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="">
        <BackButton />
      </div>
      <LoginRegisterForm />
    </div>
  );
}
