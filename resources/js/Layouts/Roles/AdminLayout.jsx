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
    Settings,
    History,
    Search,
    Bell,
    ChevronDown,
    Menu,
    LayoutGrid,
    Inbox,
    Star,
    Clock,
    Users,
    Shield,
    BarChart3,
    Database,
    Activity,
    Sun,
    Moon,
} from "lucide-react";

export default function AdminLayout({ children }) {
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

    // Navigation principale (visible pour admin)
    const mainNav = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: Home,
            color: "blue",
            show: true,
        },
        {
            name: "Documents",
            href: "/documents",
            icon: FileText,
            color: "green",
            show: true,
        },
        {
            name: "Upload",
            href: "/documents/upload",
            icon: Upload,
            color: "purple",
            show: can.uploadDocuments,
        },
        {
            name: "Catégories",
            href: "/categories",
            icon: FolderTree,
            color: "orange",
            show: can.viewCategories,
        },
        {
            name: "Tags",
            href: "/tags",
            icon: Tags,
            color: "pink",
            show: can.viewTags,
        },
    ].filter((item) => item.show);

    // Navigation administration
    const adminNav = [
        {
            name: "Utilisateurs",
            href: "/users",
            icon: Users,
            color: "red",
            show: can.viewUsers,
        },
        {
            name: "Historique",
            href: "/access-logs",
            icon: History,
            color: "gray",
            show: can.viewLogs,
        },
        {
            name: "Statistiques",
            href: "/stats",
            icon: BarChart3,
            color: "blue",
            show: can.viewStats,
        },
        {
            name: "Paramètres",
            href: "/settings",
            icon: Settings,
            color: "slate",
            show: can.manageUsers,
        },
    ].filter((item) => item.show);

    // Dossiers rapides
    const quickFolders = [
        {
            name: "Documents récents",
            icon: Clock,
            href: "/documents?sort=recent",
            count: 12,
        },
        {
            name: "En attente de validation",
            icon: Inbox,
            href: "/documents?filter=pending",
            count: 3,
        },
        {
            name: "Favoris",
            icon: Star,
            href: "/documents?filter=favorites",
            count: 7,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? "w-72" : "w-20"} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <FileText size={18} className="text-white" />
                            </div>
                            <span className="font-bold text-lg dark:text-white">
                                Archidoc
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 px-2 py-0.5 rounded-full">
                                Admin
                            </span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
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

                {/* Mes Workflows */}
                {sidebarOpen && (
                    <div className="px-4 py-4">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Mes Workflows
                        </h2>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-200">
                                    Dossiers de travail
                                </span>
                                <span className="text-xs bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                    3
                                </span>
                            </div>
                            <div className="space-y-2">
                                {quickFolders.map((folder, idx) => (
                                    <Link
                                        key={idx}
                                        href={folder.href}
                                        className="flex items-center justify-between text-xs px-2 py-1 hover:bg-white dark:hover:bg-gray-600 rounded"
                                    >
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {folder.name}
                                        </span>
                                        <span className="text-gray-400">
                                            {folder.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation principale */}
                <div className="flex-1 overflow-y-auto px-4">
                    {sidebarOpen && (
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Navigation
                        </h2>
                    )}
                    <nav className="space-y-1">
                        {mainNav.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${
                                    sidebarOpen ? "" : "justify-center"
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${item.color}-100  text-${item.color}-600 dark: text-${item.color}-200 dark:text-${item.color}-800`}
                                >
                                    <item.icon size={18} />
                                </div>
                                {sidebarOpen && (
                                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Section Admin */}
                    {adminNav.length > 0 && sidebarOpen && (
                        <>
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
                                Administration
                            </h2>
                            <nav className="space-y-1">
                                {adminNav.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${item.color}-100  text-${item.color}-600 dark: text-${item.color}-200 dark:text-${item.color}-800`}
                                        >
                                            <item.icon size={18} />
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                        </>
                    )}

                    {/* Favoris */}
                    {sidebarOpen && (
                        <div>
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
                                Favoris
                            </h2>
                            <div className="space-y-2">
                                {quickFolders.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <item.icon
                                            size={16}
                                            className="mr-3 text-yellow-500"
                                        />
                                        <span className="flex-1">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profil utilisateur */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="relative">
                        <button
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                {user?.name?.charAt(0) || "A"}
                            </div>
                            {sidebarOpen && (
                                <>
                                    <div className="ml-3 flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Administrateur
                                        </p>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className="text-gray-400"
                                    />
                                </>
                            )}
                        </button>

                        {profileMenuOpen && sidebarOpen && (
                            <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Mon profil
                                </Link>
                                {/* <Link
                                    href="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Paramètres
                                </Link> */}
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Barre supérieure */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
                    <div className="flex-1 flex items-center">
                        {/* <div className="relative w-96">
                            <Search
                                size={18}
                                className="absolute left-3 top-2.5 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Rechercher un document..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div> */}
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
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                            <Bell
                                size={18}
                                className="text-gray-600 dark:text-gray-300"
                            />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Administrateur
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                {user?.name?.charAt(0) || "A"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
