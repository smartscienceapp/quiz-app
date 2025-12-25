"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setError("");

        // 1. Prepare form data (FastAPI expects "application/x-www-form-urlencoded")
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post("https://smartscience-backend-quiz.hf.space/token", formData);
            const token = response.data.access_token;
            // 1. Save Token
            localStorage.setItem("token", token);

            // 2. Decode Token to find Role
            const decoded: any = jwtDecode(token);
            localStorage.setItem("role", decoded.role); // "teacher" or "student"
            localStorage.setItem("user", decoded.sub);  // The username

            // 3. Go to Dashboard
            router.push("/dashboard");

        } catch (err) {
            setError("Invalid credentials. Try 'TeacherAlice' and 'secretpassword123'");
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">Login</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="p-2 border rounded text-black"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-2 border rounded text-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Sign In
                    </button>
                </form>

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
}