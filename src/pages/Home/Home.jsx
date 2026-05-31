import React from "react";
import Posts from "../Posts/Posts";
import Navbar from "../../components/layout/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="p-6">
        <Posts />
      </div>
    </>
  );
}