import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { Eye } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />

            {/* Status message */}
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="min-h-screen bg-white font-sans text-gray-800 flex items-center justify-center p-8">
                {/* Version desktop (1024px) - centrée avec largeur fixe */}
                <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col md:flex-row min-h-[700px]">
                        {/* Partie gauche - Hero section */}
                        <div className="md:w-1/2 bg-gradient-to-br from-[#1901E6]  to-purple-50 px-8 py-10 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                            <div>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                        <div className="w-5 h-5 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-white font-extrabold text-xl tracking-tight">
                                        ArchiDoc
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <h1 className="text-white text-3xl font-extrabold leading-tight mb-3">
                                        Manage your files
                                        <br />
                                        the best way
                                        {/* Smart Document Management <br /> for Modern Businesses */}
                                    </h1>
                                    <p className="text-white/80 text-sm leading-relaxed max-w-[280px]">
                                        {/* Awesome, we've created the perfect place for you to store all your documents. */}
                                        Securely store, organize and control
                                        access to all your company documents in
                                        one powerful .
                                    </p>
                                </div>
                            </div>

                            {/* Illustrations */}
                            <div className="mt-8 flex justify-center">
                                <div className="relative w-48 h-40">
                                    <div className="absolute inset-0 bg-blue-500 rounded-2xl transform skew-y-6 shadow-xl flex items-end p-4">
                                        <div className="w-full h-1/2 bg-blue-400/50 rounded-lg"></div>
                                    </div>
                                    <div className="absolute -top-6 left-4 w-12 h-16 bg-white rounded-lg shadow-lg rotate-[-12deg] flex items-center justify-center">
                                        {/* <span className="material-icons-outlined text-red-400 text-xl">
                                            
                                        </span> */}
                                    </div>
                                    <div className="absolute -top-10 left-16 w-14 h-18 bg-white rounded-lg shadow-lg rotate-[-4deg] p-2">
                                        <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                                        <div className="h-8 w-full bg-cyan-400/20 rounded"></div>
                                    </div>
                                    <div className="absolute -top-6 right-4 w-14 h-18 bg-white rounded-lg shadow-lg rotate-[8deg] p-2">
                                        <div className="h-8 w-full bg-orange-400/20 rounded mb-1"></div>
                                        <div className="h-1 w-full bg-gray-100 rounded"></div>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full border-[6px] border-gray-300 bg-white/20 backdrop-blur-sm shadow-xl flex items-center justify-center">
                                        <div className="w-8 h-2 bg-yellow-400 rounded-full absolute -bottom-4 rotate-45 transform origin-top"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partie droite - Formulaire de connexion */}
                        <div className="md:w-1/2 bg-white px-8 py-10 flex flex-col justify-center">
                            <h2 className="text-2xl font-extrabold text-gray-800 mb-8">
                                Login
                            </h2>

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 ml-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full h-14 bg-white border border-gray-200 rounded-xl px-5 text-gray-700 focus:ring-2 focus:ring-[#7C8BFF]/50 focus:border-[#7C8BFF] shadow-[0_10px_30px_-5px_rgba(124,139,255,0.15)] transition-all text-sm font-medium"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1 ml-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 ml-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="w-full h-14 bg-white border border-gray-200 rounded-xl px-5 text-gray-700 focus:ring-2 focus:ring-[#7C8BFF]/50 focus:border-[#7C8BFF] shadow-[0_10px_30px_-5px_rgba(124,139,255,0.15)] transition-all text-sm font-medium"
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            onClick={() => {
                                                const input =
                                                    document.getElementById(
                                                        "password",
                                                    );
                                                input.type =
                                                    input.type === "password"
                                                        ? "text"
                                                        : "password";
                                            }}
                                        >
                                            <span className="material-icons-outlined text-lg">
                                                <Eye />

                                            </span>
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1 ml-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember me and Forgot password */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        e.target.checked,
                                                    )
                                                }
                                                className="w-5 h-5 rounded border-gray-300 text-[#7C8BFF] focus:ring-[#7C8BFF] focus:ring-offset-0"
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500">
                                            Remember me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-xs font-semibold text-[#7C8BFF] hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                {/* Login button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-14 bg-[#645bbc] hover:bg-[#5C6AFF] text-white font-bold rounded-2xl shadow-lg shadow-[#7C8BFF]/30 transition-all active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "Logging in..." : "Login"}
                                </button>
                            </form>

                            {/* Separator */}
                            <div className="relative my-8 flex items-center justify-center">
                                <div className="absolute w-full h-[1px] bg-gray-200"></div>
                                <span className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
                                    or
                                </span>
                            </div>

                            {/* Social login buttons */}
                            {/* <div className="flex justify-center space-x-6 mb-8">
                                <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
                                            fill="#1877F2"
                                        ></path>
                                    </svg>
                                </button>
                                <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        ></path>
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        ></path>
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        ></path>
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        ></path>
                                    </svg>
                                </button>
                            </div> */}

                            {/* Create account link */}
                            <p className="text-center text-sm font-semibold text-gray-500">
                                Don't have an account?{" "}
                                <Link
                                     href="./../#request"
                                    className="text-[#7C8BFF] hover:underline"
                                >
                                    Demande d'acces
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
