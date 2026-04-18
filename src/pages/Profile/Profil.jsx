import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import { Avatar, Button, Input, Card, CardContent } from "@heroui/react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.photo || null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔐 Change Password
  async function changePassword(e) {
    e.preventDefault();

    try {
      setLoadingPassword(true);

      await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        { password, newPassword },
        { headers: { token } }
      );

      alert("Password changed 🔥");
      handleLogout();

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error changing password ❌");
    } finally {
      setLoadingPassword(false);
    }
  }

  // 🖼️ Upload Image
  async function uploadImage(e) {
    e.preventDefault();

    if (!file) return alert("Select image first");

    try {
      setLoadingImage(true);

      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        { headers: { token } }
      );

      const newPhoto = res.data?.data?.photo;

      if (newPhoto) {
        setPreview(newPhoto);

        // update local user
        const updatedUser = { ...user, photo: newPhoto };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      alert("Image uploaded 🔥");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Upload failed ❌");
    } finally {
      setLoadingImage(false);
    }
  }

  // 📸 Preview before upload
  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Navbar/>
    
      <div className="w-full h-64 animated-gradient-bg mt-16 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 animate-slide-up pb-20">
        <Card className="w-full bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-visible">
          <CardContent className="p-8">
            
            {/* Header & Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-6 -mt-20 mb-8">
              <div className="relative group cursor-pointer">
                <Avatar 
                  src={preview || "https://via.placeholder.com/150"}
                  className="w-32 h-32 text-large ring-4 ring-white shadow-xl"
                  isBordered
                  color="primary"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-sm font-semibold">Change</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              
              <div className="text-center sm:text-left mt-4 sm:mt-12 flex-1">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user?.name}</h1>
                <p className="text-gray-500 font-medium">{user?.email}</p>
              </div>
              
              <div className="mt-4 sm:mt-12 flex gap-3">
                 <Button
                    color="primary"
                    onPress={uploadImage}
                    isLoading={loadingImage}
                    isDisabled={!file}
                    className="font-semibold shadow-md shadow-blue-500/20"
                 >
                    Save Photo
                 </Button>
              </div>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Content Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Left Column: Info */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Account Details</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Email Address</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Joined</p>
                    <p className="font-medium text-gray-900">Recently</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Security */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Security</h3>
                <form onSubmit={changePassword} className="flex flex-col gap-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <Input
                    type="password"
                    label="Current Password"
                    variant="bordered"
                    placeholder="Enter current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Input
                    type="password"
                    label="New Password"
                    variant="bordered"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <Button
                    type="submit"
                    color="primary"
                    isLoading={loadingPassword}
                    className="w-full font-bold shadow-md shadow-blue-500/20 mt-2"
                  >
                    Update Password
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">Log out from this device to secure your account.</p>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={handleLogout}
                    className="w-full font-bold"
                  >
                    Logout Securely
                  </Button>
                </div>
              </div>

            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}