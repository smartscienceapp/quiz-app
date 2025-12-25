"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");

    // Teacher State: Question Form
    const [questionText, setQuestionText] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [correct, setCorrect] = useState("");

    const router = useRouter();

    useEffect(() => {
        // 1. Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // Kick them out if no token
        } else {
            setRole(localStorage.getItem("role") || "");
            setUsername(localStorage.getItem("user") || "");
        }
    }, []);

    const handleCreateQuestion = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "https://smartscience-backend-quiz.hf.space/questions",
                {
                    text: questionText,
                    options: [option1, option2, option3],
                    correct_answer: correct,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }, // <--- SHOW THE KEY CARD
                }
            );
            alert("Question Created!");
            setQuestionText(""); // Clear form
        } catch (error) {
            console.error(error);
            alert("Failed to create question");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-black">
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/leaderboard")}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        🏆 Leaderboard
                    </button>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            router.push("/login");
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                {/* TEACHER SECTION */}
                {role === "teacher" && (
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Create a New Question</h2>
                        <form onSubmit={handleCreateQuestion} className="flex flex-col gap-4">
                            <input
                                className="border p-2 rounded"
                                placeholder="Question Text (e.g. What is 2+2?)"
                                value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <input className="border p-2 rounded" placeholder="Option A" value={option1} onChange={(e) => setOption1(e.target.value)} />
                                <input className="border p-2 rounded" placeholder="Option B" value={option2} onChange={(e) => setOption2(e.target.value)} />
                                <input className="border p-2 rounded" placeholder="Option C" value={option3} onChange={(e) => setOption3(e.target.value)} />
                            </div>
                            <input
                                className="border p-2 rounded"
                                placeholder="Correct Answer (Must match one option exactly!)"
                                value={correct} onChange={(e) => setCorrect(e.target.value)}
                            />
                            <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                                Publish Question
                            </button>
                        </form>
                    </div>
                )}

                {/* STUDENT SECTION */}
                {role === "student" && (
                    <div className="bg-white p-6 rounded shadow-md text-center">
                        <h2 className="text-xl font-bold mb-4">Ready for your Exam?</h2>
                        <p className="mb-4">Questions have been prepared by your teacher.</p>
                        <button
                            onClick={() => router.push("/exam")}
                            className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
                        >
                            Start Quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}