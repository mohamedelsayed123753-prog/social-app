import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [user, setUser] = useState(null);
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
    navigate("/login");
  };

  return (
    <nav className="glass-nav fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">

     
      <Link to="/home" className="text-2xl font-extrabold tracking-tight text-gradient">
        SocialApp
      </Link>

     
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/home"
              className={`font-medium hover:text-blue-600 transition-colors ${location.pathname === '/home' || location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Home
            </Link>

            <span className="bg-blue-50 text-blue-600 font-semibold px-4 py-1.5 rounded-full text-sm border border-blue-100">
               {user.name || user.username}
            </span>
            <Link
              to="/profile"
              className={`font-medium hover:text-blue-600 transition-colors ${location.pathname === '/home' || location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
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
            <Button as={Link} to="/login" variant="light" className="font-medium">
              Login
            </Button>
            <Button as={Link} to="/register" color="primary" className="font-medium shadow-md shadow-blue-500/20">
              Register
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}