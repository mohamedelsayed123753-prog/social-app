import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Card, CardHeader, CardContent, CardFooter, Button } from "@heroui/react";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getPosts() {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://route-posts.routemisr.com/posts",
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      // ✅ الصحيح حسب الـ API اللي بعته
      setPosts(res.data.data.posts);

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 mb-10 flex flex-col gap-6 px-4 animate-slide-up">

      <h1 className="text-3xl font-extrabold mb-5 text-gray-900">
        Your Feed ✨
      </h1>

      {posts.map((post) => (
        <Card 
          key={post._id} 
          className="w-full bg-white/80 backdrop-blur-md soft-shadow hover:-translate-y-1 transition-all duration-300 border border-gray-100"
        >
          <CardHeader className="justify-between px-6 py-4">
            <div className="flex gap-4 items-center">
              <Avatar 
                isBordered 
                color="primary" 
                radius="full" 
                src={post.user.photo} 
                className="w-12 h-12 text-large"
              />
              <div className="flex flex-col items-start justify-center">
                <h4 className="text-base font-semibold leading-none text-gray-900">{post.user.name}</h4>
                <h5 className="text-sm tracking-tight text-gray-500 mt-1">@{post.user.username}</h5>
              </div>
            </div>
            <Button
              color="primary"
              radius="full"
              size="sm"
              variant="flat"
            >
              Follow
            </Button>
          </CardHeader>

          <CardContent className="px-6 py-2">
            <p className="text-gray-800 text-lg leading-relaxed">{post.body}</p>
            
            {/* Image */}
            {post.image && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
                <img
                  alt="Post Image"
                  className="object-cover w-full max-h-[500px]"
                  src={post.image}
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="gap-6 px-6 py-4 border-t border-gray-100/50">
            <div className="flex gap-2 items-center cursor-pointer hover:text-red-500 transition-colors text-gray-500">
              <span className="text-lg">❤️</span>
              <p className="font-medium text-sm">{post.likesCount || 0}</p>
            </div>
            <div className="flex gap-2 items-center cursor-pointer hover:text-blue-500 transition-colors text-gray-500">
              <span className="text-lg">💬</span>
              <p className="font-medium text-sm">{post.commentsCount || 0}</p>
            </div>
            <div className="flex gap-2 items-center cursor-pointer hover:text-green-500 transition-colors text-gray-500 ml-auto">
              <span className="text-lg">🔁</span>
              <p className="font-medium text-sm">{post.sharesCount || 0}</p>
            </div>
          </CardFooter>
        </Card>
      ))}

    </div>
  );
}