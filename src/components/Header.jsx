import logo from "../assets/holidaze-logo-bg.png";

export default function Header() {
  return (
    <header className="p-4 bg-neutral-white shadow">
      <div className="max-w-6xl xl:px-8 mx-auto flex justify-between items-center px-4">
        <img src={logo} className="max-h-16" alt="Holidaze logo" />
        <nav className="space-x-6">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/profile" className="hover:underline">
            Profile
          </a>
          <a href="/login" className="hover:underline">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
