"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ExamPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/login");

        // Fetch questions (Answers are hidden by backend!)
        axios.get("https://quiz-app-backend-mu.vercel.app/questions")
            .then(res => setQuestions(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSelect = (questionId: number, option: string) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(
                "https://quiz-app-backend-mu.vercel.app/submit",
                { answers: answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResult(res.data); // Server returns { score: 2, total: 5 }
        } catch (err) {
            alert("Error submitting quiz");
        }
    };

    if (result) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-black">
                <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
                <p className="text-2xl">You scored: <span className="text-green-600 font-bold">{result.score} / {result.total}</span></p>
                <button onClick={() => router.push("/dashboard")} className="mt-8 bg-blue-600 text-white px-6 py-2 rounded">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-black">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-6 border-b pb-4">Final Exam</h1>

                {questions.map((q, index) => (
                    <div key={q.id} className="mb-8">
                        <p className="font-semibold text-lg mb-3">{index + 1}. {q.text}</p>
                        <div className="flex flex-col gap-2">
                            {q.options.map((opt: string) => (
                                <label key={opt} className={`p-3 border rounded cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${answers[q.id] === opt ? 'bg-blue-50 border-blue-500' : ''}`}>
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={opt}
                                        onChange={() => handleSelect(q.id, opt)}
                                        className="w-4 h-4"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold text-lg"
                >
                    Submit Exam
                </button>
            </div>
        </div>
    );
}