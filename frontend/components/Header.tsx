"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("user") || "User");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Panel Kontrol</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Halo, <b>{username}</b></span>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}