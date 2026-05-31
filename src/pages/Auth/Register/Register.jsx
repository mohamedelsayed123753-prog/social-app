import React, { useState } from 'react';
import { Button, Input, RadioGroup, Radio } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { useForm, Controller } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

// ✅ Zod Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 chars").max(20),

  username: z.string().min(3, "Username is required"),

  email: z.string().email("Invalid email"),

  dateOfBirth: z.string().min(1, "Date of birth is required"),

  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" })
  }),

  password: z
    .string()
    .min(6, "Password must be at least 6 chars")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number"),

  rePassword: z.string()
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"]
});

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [apiError, setApiError] = useState("");

  // ✅ React Hook Form + Zod
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });
  const navigate = useNavigate();

  // ✅ API CALL
  async function OnSubmitRegister(data) {
    setApiError("");
    try {
      const payload = {
        ...data,
        gender: data.gender.toLowerCase()
      };

      const res = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        payload
      );

      console.log("SUCCESS:", res.data);

      // ✅ redirect بعد النجاح
      navigate("/login");
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      setApiError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient-bg p-6 py-20">
      <div className="w-full max-w-lg glass-card p-10 animate-slide-up">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us today to get started.</p>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
            {apiError}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(OnSubmitRegister)}>

          <div className="flex gap-4">
            {/* NAME */}
            <div className="flex-1">
              <Input
                label="Full Name"
                variant="bordered"
                placeholder="John Doe"
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            </div>

            {/* USERNAME */}
            <div className="flex-1">
              <Input
                label="Username"
                variant="bordered"
                placeholder="johndoe"
                {...register("username")}
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <Input
              type="email"
              label="Email Address"
              variant="bordered"
              placeholder="john@example.com"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>

          {/* DOB */}
          <div>
            <Input
              type="date"
              label="Date of Birth"
              variant="bordered"
              placeholder=" "
              {...register("dateOfBirth")}
              isInvalid={!!errors.dateOfBirth}
              errorMessage={errors.dateOfBirth?.message}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Input
              label="Password"
              variant="bordered"
              placeholder="Enter password"
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

          {/* REPASSWORD */}
          <div className="relative">
            <Input
              label="Confirm Password"
              variant="bordered"
              placeholder="Confirm password"
              className="w-full"
              type={showRePassword ? "text" : "password"}
              {...register("rePassword")}
              isInvalid={!!errors.rePassword}
              errorMessage={errors.rePassword?.message}
            />
            <Button
              type="button"
              isIconOnly
              size="sm"
              variant="light"
              aria-label="Toggle confirm password visibility"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
              onPress={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <Eye className="size-4 text-gray-500" /> : <EyeSlash className="size-4 text-gray-500" />}
            </Button>
          </div>

          {/* GENDER */}
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">Gender</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  value="male" 
                  {...register("gender")} 
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  value="female" 
                  {...register("gender")} 
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">Female</span>
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
          </div>

          {/* SUBMIT */}
          <Button 
            type="submit" 
            isLoading={isSubmitting} 
            color="primary" 
            size="lg" 
            className="w-full font-bold mt-4 shadow-lg shadow-blue-500/30"
          >
            Create Account
          </Button>

          {/* LOGIN LINK */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}