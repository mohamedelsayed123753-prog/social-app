import React, { useState } from "react";
import axios from "axios";

export default function UploadProfileImage({ token, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function uploadImage(e) {
    e.preventDefault();

    if (!file) {
      alert("Please select an image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            token: token,
          },
        }
      );

      alert("Profile image updated successfully");

      
      if (onSuccess) {
        onSuccess(res.data);
      }

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={uploadImage} className="flex flex-col gap-3 mt-6">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        {loading ? "Uploading..." : "Upload Profile Image"}
      </button>
    </form>
  );
}