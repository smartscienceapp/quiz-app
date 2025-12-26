"use client";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar"; // Assumed this exists
import Header from "@/components/Header";   // Assumed this exists

export default function Dashboard() {
  const router = useRouter();

  // User State
  const [role, setRole] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Teacher State: Question Form
  const [questionText, setQuestionText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [correct, setCorrect] = useState("");

  useEffect(() => {
    // 1. Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setRole(localStorage.getItem("role") || "");
      setUsername(localStorage.getItem("user") || "User");
      setLoading(false);
    }
  }, [router]);

  const handleCreateQuestion = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!questionText || !option1 || !option2 || !option3 || !correct) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        "https://smartscience-backend-quiz.hf.space/questions",
        {
          text: questionText,
          options: [option1, option2, option3],
          correct_answer: correct,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Question Created Successfully!");
      // Reset Form
      setQuestionText("");
      setOption1("");
      setOption2("");
      setOption3("");
      setCorrect("");
    } catch (error) {
      console.error(error);
      alert("Failed to create question. Check console for details.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar on the left */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* 2. Header on top */}
        <Header />

        {/* 3. Main Dashboard Content */}
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Welcome & Quick Actions */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {username} ({role})
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/leaderboard")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  🏆 Leaderboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* TEACHER VIEW */}
            {role === "teacher" && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">
                  Create a New Question
                </h2>
                <form onSubmit={handleCreateQuestion} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <input
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. What is the atomic number of Carbon?"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      className="border p-2 rounded"
                      placeholder="Option A"
                      value={option1}
                      onChange={(e) => setOption1(e.target.value)}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="Option B"
                      value={option2}
                      onChange={(e) => setOption2(e.target.value)}
                    />
                    <input
                      className="border p-2 rounded"
                      placeholder="Option C"
                      value={option3}
                      onChange={(e) => setOption3(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                    <input
                      className="w-full border p-2 rounded bg-green-50"
                      placeholder="Must match one option exactly"
                      value={correct}
                      onChange={(e) => setCorrect(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: Copy/paste the correct option here to ensure it matches.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="bg-green-600 text-white p-3 rounded font-semibold hover:bg-green-700 transition mt-2"
                  >
                    Publish Question
                  </button>
                </form>
              </div>
            )}

            {/* STUDENT VIEW */}
            {role === "student" && (
              <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-200">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Ready for your Exam?</h2>
                <p className="mb-8 text-gray-600">
                  Your teacher has prepared new questions. Good luck!
                </p>
                <button
                  onClick={() => router.push("/exam")}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                >
                  Start Quiz Now
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}