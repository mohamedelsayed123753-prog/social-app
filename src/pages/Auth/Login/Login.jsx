import React, { useState } from 'react';
import { Button, Input } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Navigate, useNavigate, Link } from "react-router-dom";


const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars")
});

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/home" replace />;
  }


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  
  async function onSubmitLogin(data) {
    setApiError("");
    try {
      const res = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        data
      );

      console.log("LOGIN SUCCESS:", res.data);

      // ✅ تأكد إن العملية نجحت
      if (res.data.success || res.data.message === "success") {
        const token = res.data.token || res.data.data?.token;
        const user = res.data.user || res.data.data?.user;

        if (token) {
          // ✅ خزّن البيانات
          localStorage.setItem("token", token);
          if (user) localStorage.setItem("user", JSON.stringify(user));

          // ✅ خلي axios يضيف التوكن تلقائيًا
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // ✅ redirect
          navigate("/home");
        }
      }

    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      setApiError(error.response?.data?.message || "Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient-bg p-6">
      <div className="w-full max-w-md glass-card p-10 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Please enter your details to sign in.</p>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
            {apiError}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmitLogin)}>

          
          <div>
            <Input
              type="email"
              label="Email"
              variant="bordered"
              placeholder="Enter your email"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>

         
          <div className="relative">
            <Input
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
              className="w-full"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Button
              type="button"
              isIconOnly
              size="sm"
              variant="light"
              aria-label="Toggle password visibility"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye className="size-4 text-gray-500" /> : <EyeSlash className="size-4 text-gray-500" />}
            </Button>
          </div>

        
          <Button 
            type="submit" 
            isLoading={isSubmitting} 
            color="primary" 
            size="lg" 
            className="w-full font-bold mt-2 shadow-lg shadow-blue-500/30"
          >
            Sign In
          </Button>

         
          <p className="text-sm text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}