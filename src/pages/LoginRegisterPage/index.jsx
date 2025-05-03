import { useForm } from "react-hook-form";
import useAuthStore from "../stores/authStore";
import { useState } from "react";

const API = "https://v2.api.noroff.dev/auth";

export default function LoginRegisterPage() {
  const { register, handleSubmit, reset } = useForm();
  const { login } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  async function onSubmit(data) {
    const url = isLogin ? `${API}/login` : `${API}/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.errors?.[0]?.message || "Something went wrong");

      const profile = result.data;
      const token = result.data.accessToken;

      login(profile, token);
      reset();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isLogin ? "Login" : "Register"}
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full p-2 border"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
        />

        {!isLogin && (
          <>
            <input
              {...register("name")}
              type="text"
              placeholder="Name"
              className="w-full p-2 border"
            />
            <input
              {...register("avatar")}
              type="url"
              placeholder="Avatar URL (optional)"
              className="w-full p-2 border"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-primaryRed text-white p-2 rounded"
        >
          {isLogin ? "Log in" : "Register"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 underline"
      >
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}
