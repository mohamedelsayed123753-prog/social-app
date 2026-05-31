import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // إضافة حالة للقائمة
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="glass-nav fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/home" className="text-2xl font-extrabold tracking-tight text-gradient">
        SocialApp
      </Link>

      {/* زر القائمة للشاشات الصغيرة */}
      <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
        </svg>
      </button>

      {/* الروابط: تختفي في الموبايل وتظهر في md وما فوق */}
      <div className={`absolute md:relative top-full left-0 w-full md:w-auto bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-6 md:p-0 flex flex-col md:flex-row items-center gap-4 transition-all duration-300 ${isMenuOpen ? "flex" : "hidden md:flex"}`}>
        {user ? (
          <>
            <Link
              to="/home"
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium hover:text-blue-600 transition-colors ${location.pathname === '/home' || location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Home
            </Link>

            <span className="bg-blue-50 text-blue-600 font-semibold px-4 py-1.5 rounded-full text-sm border border-blue-100">
              {user.name || user.username}
            </span>

            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium hover:text-blue-600 transition-colors ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Profile
            </Link>

            <Button
              color="danger"
              variant="flat"
              onPress={handleLogout}
              className="font-medium"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" variant="light" className="font-medium" onClick={() => setIsMenuOpen(false)}>
              Login
            </Button>
            <Button as={Link} to="/register" color="primary" className="font-medium shadow-md shadow-blue-500/20" onClick={() => setIsMenuOpen(false)}>
              Register
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}