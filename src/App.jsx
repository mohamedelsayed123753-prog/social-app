

import './App.css'


import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Register from './pages/Auth/Register/Register'
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profil';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

      { path: "/register", element: <Register /> },
  {
    element: <AuthLayout />, // 👈 الأب لكل الصفحات المحمية
    children: [
      {
        path: "/",
        element: <Home />, // default page
      },
        {
          path: "/home",
          element: <Home />,
        },  {path:"profile", element:<Profile />}
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;