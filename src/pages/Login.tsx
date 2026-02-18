import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.jpeg"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login delay
        setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Left Section: Branding & Visuals */}
                <div className="w-full md:w-1/2 bg-[#4E1C5A] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                    <div className="z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <img
                                src={logo}
                                alt="Sankya Logo"
                                className="h-10 w-10 object-contain bg-white rounded-lg p-1"
                            />
                            <span className="text-2xl font-bold tracking-wide">ANKYA AI</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Welcome back to <br />
                            <span className="text-purple-200">Intelligent Planning</span>
                        </h1>

                        <p className="text-purple-100 text-lg max-w-sm">
                            Streamline your financial forecasting and strategic planning with power and precision.
                        </p>
                    </div>

                    <div className="z-10 mt-12 space-y-4">
                        <div className="flex items-center gap-3 text-purple-100">
                            <div className="p-1 bg-white/10 rounded-full">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm">Real-time Financial Analytics</span>
                        </div>
                        <div className="flex items-center gap-3 text-purple-100">
                            <div className="p-1 bg-white/10 rounded-full">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm">AI-Driven Forecasting Models</span>
                        </div>
                        <div className="flex items-center gap-3 text-purple-100">
                            <div className="p-1 bg-white/10 rounded-full">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm">Secure Data Integration</span>
                        </div>
                    </div>

                    <div className="text-xs text-purple-300 mt-8 z-10">
                        © 2026 Ankya AI. All Rights Reserved.
                    </div>
                </div>

                {/* Right Section: Login Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign In</h2>
                        <p className="text-slate-500 mb-8">
                            Access your dashboard to manage your portfolio.
                        </p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4E1C5A] focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm font-medium text-[#4E1C5A] hover:text-purple-800 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#4E1C5A] focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 bg-slate-50 focus:bg-white pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4E1C5A] hover:bg-[#3a1543] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-purple-900/10 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Signing in...</span>
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?{" "}
                                <a href="#" className="font-semibold text-[#4E1C5A] hover:text-purple-800 transition-colors">
                                    Contact Support
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
