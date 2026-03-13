import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { usePermissions } from "@/Hooks/usePermissions";
import { useDarkMode } from "@/Hooks/useDarkMode";
import {
    Home,
    FileText,
    FolderTree,
    Tags,
    Upload,
    LogOut,
    User,
    Search,
    Bell,
    ChevronDown,
    Menu,
    Star,
    Clock,
    Inbox,
    Sun,
    Moon,
} from "lucide-react";

export default function ContributorLayout({ children }) {
    const { user, can } = usePermissions();
    const { toggleTheme, isDark } = useDarkMode();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fonction de déconnexion avec Inertia
    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    // Navigation pour contributeur (peut uploader, voir catégories/tags mais pas modifier)
    const navigation = [
        { name: "Tableau de bord", href: "/dashboard", icon: Home, show: true },
        {
            name: "Mes documents",
            href: "/documents",
            icon: FileText,
            show: true,
        },
        {
            name: "Uploader",
            href: "/documents/upload",
            icon: Upload,
            show: can.uploadDocuments,
            highlight: true,
        },
        {
            name: "Catégories",
            href: "/categories",
            icon: FolderTree,
            show: can.viewCategories,
        },
        { name: "Tags", href: "/tags", icon: Tags, show: can.viewTags },
    ].filter((item) => item.show);

    const quickFolders = [
        {
            name: "Mes documents",
            icon: FileText,
            href: "/documents?filter=mine",
            count: 12,
        },
        {
            name: "Récents",
            icon: Clock,
            href: "/documents?sort=recent",
            count: 5,
        },
        {
            name: "Favoris",
            icon: Star,
            href: "/documents?filter=favorites",
            count: 3,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar plus simple */}
            <div
                className={`${sidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <FileText size={18} className="text-white" />
                            </div>
                            <span className="font-bold text-lg dark:text-white">
                                Archidoc
                            </span>
                            <span className="text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 px-2 py-0.5 rounded-full">
                                Contributeur
                            </span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto">
                            <FileText size={18} className="text-white" />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <Menu
                            size={18}
                            className="text-gray-500 dark:text-gray-400"
                        />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <nav className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-lg transition-colors group ${
                                    item.highlight
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                } ${sidebarOpen ? "" : "justify-center"}`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        item.highlight
                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    <item.icon size={18} />
                                </div>
                                {sidebarOpen && (
                                    <span
                                        className={`ml-3 text-sm font-medium ${
                                            item.highlight
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-200"
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Dossiers rapides */}
                    {sidebarOpen && (
                        <div className="mt-8">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Mes dossiers
                            </h2>
                            <div className="space-y-2">
                                {quickFolders.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <item.icon
                                            size={16}
                                            className="mr-3 text-gray-400"
                                        />
                                        <span className="flex-1">
                                            {item.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {item.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profil */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <button
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className="flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                            {user?.name?.charAt(0) || "C"}
                        </div>
                        {sidebarOpen && (
                            <>
                                <div className="ml-3 flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Contributeur
                                    </p>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className="text-gray-400"
                                />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
                    <div className="flex-1">
                        <div className="relative w-96">
                            <Search
                                size={18}
                                className="absolute left-3 top-2.5 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title={isDark ? "Mode clair" : "Mode sombre"}
                        >
                            {isDark ? (
                                <Sun size={18} className="text-yellow-500" />
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
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                            {user?.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-800 dark:hover:text-red-400"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
