import LoginRegisterForm from "../../components/LoginRegisterForm";
import BackButton from "../../components/Buttons/BackButton";
import { useEffect } from "react";

export default function LoginRegisterPage() {
  useEffect(() => {
    document.title = "Login or Register | Holidaze";
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="">
        <BackButton />
      </div>
      <LoginRegisterForm />
    </div>
  );
}
