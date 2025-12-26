"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default student
  const router = useRouter();

  // Proteksi Halaman
  useEffect(() => {
    const currentRole = localStorage.getItem("role");
    if (currentRole !== "admin") {
      alert("Akses Ditolak! Anda bukan Admin.");
      router.push("/dashboard");
    }
  }, []);

  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // GANTI URL INI DENGAN URL HUGGING FACE KAMU
      await axios.post(
        "https://USERNAME-backend-quiz-kamu.hf.space/admin/create-user", 
        { username, password, role }, // Kirim data JSON
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Sukses! User ${username} berhasil dibuat.`);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat user. Pastikan username belum dipakai.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah User Baru</h2>
            
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 p-2 w-full border rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 w-full border rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 p-2 w-full border rounded text-black bg-white"
                >
                  <option value="student">Student (Siswa)</option>
                  <option value="teacher">Teacher (Guru)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4">
                Buat Akun
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}