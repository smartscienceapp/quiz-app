"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 hidden md:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">Smart Science</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Menu</p>
        
        <Link href="/dashboard" className="p-3 rounded hover:bg-gray-800 flex items-center gap-2">
          🏠 Dashboard
        </Link>

        {/* MENU KHUSUS ADMIN */}
        {role === "admin" && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Admin Zone</p>
            <Link href="/admin/users" className="block p-3 rounded hover:bg-gray-800 text-green-400">
              👥 Kelola User
            </Link>
          </div>
        )}

        {/* MENU KHUSUS GURU */}
        {role === "teacher" && (
           <Link href="/dashboard" className="p-3 rounded hover:bg-gray-800 text-yellow-400">
             📝 Buat Soal
           </Link>
        )}

        {/* MENU KHUSUS SISWA */}
        {role === "student" && (
           <Link href="/exam" className="p-3 rounded hover:bg-gray-800 text-blue-300">
             ✍️ Mulai Ujian
           </Link>
        )}
        
        <Link href="/leaderboard" className="p-3 rounded hover:bg-gray-800">
          🏆 Leaderboard
        </Link>
      </nav>
    </aside>
  );
}