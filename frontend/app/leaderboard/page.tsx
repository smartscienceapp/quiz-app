"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
    const [scores, setScores] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Anyone can view the leaderboard (no token needed, optional)
        axios.get("http://127.0.0.1:8000/leaderboard")
            .then(res => setScores(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-yellow-400">🏆 Hall of Fame</h1>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
                            <tr>
                                <th className="p-4">Rank</th>
                                <th className="p-4">Student</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((attempt, index) => (
                                <tr key={attempt.id} className="border-b border-gray-700 hover:bg-gray-750">
                                    <td className="p-4 font-bold text-xl">
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                    </td>
                                    <td className="p-4 font-semibold">{attempt.username}</td>
                                    <td className="p-4 text-gray-400 text-sm">{attempt.date}</td>
                                    <td className="p-4 text-right font-mono text-yellow-400 font-bold text-lg">
                                        {attempt.score} pts
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {scores.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No attempts yet. Be the first!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}