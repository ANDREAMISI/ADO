import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { usePermissions } from "@/Hooks/usePermissions";
import { useDarkMode } from "@/Hooks/useDarkMode";
import {
    Home,
    FileText,
    FolderTree,
    Tags,
    LogOut,
    User,
    Search,
    Bell,
    Sun,
    Moon,
} from "lucide-react";

export default function ReaderLayout({ children }) {
    const { user } = usePermissions();
    const { toggleTheme, isDark } = useDarkMode();
    const [searchQuery, setSearchQuery] = useState("");

    // Fonction de déconnexion avec Inertia
    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    const navigation = [
        { name: "Accueil", href: "/dashboard", icon: Home },
        { name: "Documents", href: "/documents", icon: FileText },
        { name: "Catégories", href: "/categories", icon: FolderTree },
        { name: "Tags", href: "/tags", icon: Tags },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header simple en haut */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg flex items-center justify-center mr-3">
                                <FileText size={18} className="text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                Archidoc
                            </h1>
                            <span className="ml-3 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                Lecteur
                            </span>

                            <div className="hidden md:flex ml-10 space-x-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    >
                                        <item.icon size={16} className="mr-2" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-2.5 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-9 pr-4 py-2 w-64 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title={isDark ? "Mode clair" : "Mode sombre"}
                            >
                                {isDark ? (
                                    <Sun
                                        size={18}
                                        className="text-yellow-500"
                                    />
                                ) : (
                                    <Moon
                                        size={18}
                                        className="text-gray-600 dark:text-gray-300"
                                    />
                                )}
                            </button>

                            <Bell
                                size={18}
                                className="text-gray-600 dark:text-gray-300"
                            />

                            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Lecteur
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg flex items-center justify-center text-white">
                                    {user?.name?.charAt(0) || "L"}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-red-600 hover:text-red-800 dark:hover:text-red-400"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
