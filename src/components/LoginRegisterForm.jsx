// components/LoginRegisterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import ErrorMessage from "./Shared/ErrorMessage";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function LoginRegisterForm() {
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    avatarUrl: "",
    venueManager: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); // Clear previous

    try {
      const res = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(loginData),
      });

      const json = await res.json();

      if (!res.ok) {
        setLoginError(json.errors?.[0]?.message || "Login failed.");
        return;
      }

      if (json.data?.accessToken) {
        login(json.data, json.data.accessToken);
        navigate("/profile");
      } else {
        setLoginError("Login failed: Missing access token.");
      }
    } catch (err) {
      setLoginError("An unexpected login error occurred.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError(""); // Clear previous

    try {
      const payload = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        venueManager: registerData.venueManager,
      };

      if (registerData.avatarUrl) {
        payload.avatar = {
          url: registerData.avatarUrl,
          alt: registerData.name,
        };
      }

      const res = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setRegisterError(json.errors?.[0]?.message || "Registration failed.");
        return;
      }

      // Optional success message:
      setRegisterError("✅ Registration successful! Please log in.");
      setLoginData({
        email: registerData.email,
        password: registerData.password,
      });
    } catch (err) {
      setRegisterError("An unexpected registration error occurred.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-2">
        Want to book a place or list a venue?
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Why not do both? Login or register today.
      </p>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Log in
        </button>
        <ErrorMessage message={loginError} />
      </form>

      <hr className="mb-6" />

      {/* Register Form */}
      <form onSubmit={handleRegister}>
        <h2 className="text-lg font-semibold mb-3">Register</h2>
        <input
          type="text"
          placeholder="Name (username)"
          value={registerData.name}
          onChange={(e) =>
            setRegisterData({ ...registerData, name: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={registerData.email}
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={registerData.password}
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="url"
          placeholder="Avatar URL (optional)"
          value={registerData.avatarUrl}
          onChange={(e) =>
            setRegisterData({ ...registerData, avatarUrl: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        />
        <p className="text-xs text-gray-500 mb-3">
          Provide a valid URL for your avatar image.
        </p>
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={registerData.venueManager}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                venueManager: e.target.checked,
              })
            }
          />
          I want to list venues (I'm a venue manager)
        </label>
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Register
        </button>
        <ErrorMessage message={registerError} />
      </form>
    </div>
  );
}

// // components/LoginRegisterForm.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../stores/authStore";
// import ErrorMessage from "./Shared/ErrorMessage";

// const API_KEY = import.meta.env.VITE_API_KEY;

// export default function LoginRegisterForm() {
//   const [loginError, setLoginError] = useState("");
//   const [registerError, setRegisterError] = useState("");
//   const [mode, setMode] = useState("login"); // or "register"
//   const [error, setError] = useState("");
//   const { login } = useAuthStore();
//   const navigate = useNavigate();

//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [registerData, setRegisterData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     avatarUrl: "",
//     venueManager: false,
//   });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     console.log("Login form submitted");

//     try {
//       const res = await fetch("https://v2.api.noroff.dev/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Noroff-API-Key": API_KEY,
//         },
//         body: JSON.stringify(loginData),
//       });

//       console.log("Response status:", res.status);
//       const json = await res.json();
//       console.log("Response JSON:", JSON.stringify(json, null, 2));

//       if (!res.ok) {
//         setError(json.errors?.[0]?.message || "Login failed.");
//         return;
//       }

//       if (!json.data) {
//         console.warn("No data in login response:", json);
//         setError("Unexpected response format.");
//         return;
//       }

//       if (json.data.accessToken) {
//         login(json.data, json.data.accessToken);
//         console.log("Calling login() with:", json.data);
//         navigate("/profile");
//       } else {
//         console.warn("Access token missing in response data:", json.data);
//         setError("Login failed: No access token.");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Login error.");
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         name: registerData.name,
//         email: registerData.email,
//         password: registerData.password,
//         venueManager: registerData.venueManager,
//       };

//       if (registerData.avatarUrl) {
//         payload.avatar = {
//           url: registerData.avatarUrl,
//           alt: registerData.name,
//         };
//       }

//       const res = await fetch("https://v2.api.noroff.dev/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Noroff-API-Key": API_KEY,
//         },
//         body: JSON.stringify(payload),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         setError(json.errors?.[0]?.message || "Registration failed.");
//         return;
//       }

//       if (json.data) {
//         setError("Registration successful. Please log in.");
//         setLoginData({
//           email: registerData.email,
//           password: registerData.password,
//         });
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//       setError("Registration error.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <h1 className="text-2xl font-bold text-center mb-2">
//         Want to book a place or list a venue?
//       </h1>
//       <p className="text-center text-gray-600 mb-6">
//         Why not do both? Login or register today.
//       </p>

//       {/* Login Form */}
//       <form onSubmit={handleLogin} className="mb-6">
//         <h2 className="text-lg font-semibold mb-3">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={loginData.email}
//           onChange={(e) =>
//             setLoginData({ ...loginData, email: e.target.value })
//           }
//           className="w-full p-2 border rounded mb-3"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={loginData.password}
//           onChange={(e) =>
//             setLoginData({ ...loginData, password: e.target.value })
//           }
//           className="w-full p-2 border rounded mb-4"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
//         >
//           Log in
//         </button>
//         <ErrorMessage message={error} />
//       </form>

//       <hr className="mb-6" />

//       {/* Register Form */}
//       <form onSubmit={handleRegister}>
//         <h2 className="text-lg font-semibold mb-3">Register</h2>
//         <input
//           type="text"
//           placeholder="Name (username)"
//           value={registerData.name}
//           onChange={(e) =>
//             setRegisterData({ ...registerData, name: e.target.value })
//           }
//           className="w-full p-2 border rounded mb-3"
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={registerData.email}
//           onChange={(e) =>
//             setRegisterData({ ...registerData, email: e.target.value })
//           }
//           className="w-full p-2 border rounded mb-3"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={registerData.password}
//           onChange={(e) =>
//             setRegisterData({ ...registerData, password: e.target.value })
//           }
//           className="w-full p-2 border rounded mb-3"
//           required
//         />
//         <input
//           type="url"
//           placeholder="Avatar URL (optional)"
//           value={registerData.avatarUrl}
//           onChange={(e) =>
//             setRegisterData({ ...registerData, avatarUrl: e.target.value })
//           }
//           className="w-full p-2 border rounded mb-4"
//         />
//         <p className="text-xs text-gray-500 mb-3">
//           Provide a valid URL for your avatar image.
//         </p>
//         <label className="flex items-center gap-2 mb-4">
//           <input
//             type="checkbox"
//             checked={registerData.venueManager}
//             onChange={(e) =>
//               setRegisterData({
//                 ...registerData,
//                 venueManager: e.target.checked,
//               })
//             }
//           />
//           I want to list venues (I'm a venue manager)
//         </label>
//         <button
//           type="submit"
//           className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
//         >
//           Register
//         </button>
//         <ErrorMessage message={error} />
//       </form>
//     </div>
//   );
// }
