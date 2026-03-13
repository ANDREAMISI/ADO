import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { usePermissions } from "@/Hooks/usePermissions";
import { useDarkMode } from "@/Hooks/useDarkMode";
import {
    LayoutDashboard,
    FileText,
    FolderTree,
    Tags,
    Upload,
    LogOut,
    Menu,
    User,
    Users,
    Activity,
    Sun,
    Moon,
} from "lucide-react";

export default function AuthenticatedLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, can } = usePermissions();
    const { toggleTheme, isDark } = useDarkMode();

    const navigation = [
        {
            name: "Tableau de bord",
            href: "/dashboard",
            icon: LayoutDashboard,
            show: true,
        },
        { name: "Documents", href: "/documents", icon: FileText, show: true },
        {
            name: "Catégories",
            href: "/categories",
            icon: FolderTree,
            show: true,
        },
        { name: "Tags", href: "/tags", icon: Tags, show: true },
        {
            name: "Upload",
            href: "/documents/upload",
            icon: Upload,
            show: can.uploadDocuments,
        },
        {
            name: "Utilisateurs",
            href: "/users",
            icon: Users,
            show: can.manageUsers,
        },
        {
            name: "Logs",
            href: "/access-logs",
            icon: Activity,
            show: can.viewLogs,
        },
    ].filter((item) => item.show);

    const handleLogout = (e) => {
        e.preventDefault();
        window.location.href = "/logout";
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-gray-900 dark:bg-gray-800 text-white transition-all duration-300 ${
                    sidebarOpen ? "w-64" : "w-20"
                }`}
            >
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold">ARCHIDOC</h1>
                    ) : (
                        <h1 className="text-xl font-bold">A</h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-gray-800 dark:hover:bg-gray-700 rounded"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="mt-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        >
                            <item.icon size={20} />
                            {sidebarOpen && (
                                <span className="ml-3">{item.name}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer avec infos utilisateur */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                        <div className="bg-gray-700 dark:bg-gray-600 p-2 rounded-full mr-3">
                            <User size={18} />
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user?.email}
                                </p>
                                <p className="text-xs text-blue-400 mt-1">
                                    {user?.roles?.[0] || "Aucun rôle"}
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-300 hover:text-white transition-colors w-full"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && (
                            <span className="ml-3">Déconnexion</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Top bar with dark mode toggle */}
            <div
                className={`fixed top-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 z-10 ${
                    sidebarOpen ? "left-64" : "left-20"
                }`}
            >
                <div className="flex items-center justify-end h-full px-6">
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
                </div>
            </div>

            {/* Contenu principal */}
            <div
                className={`transition-all duration-300 ${
                    sidebarOpen ? "ml-64" : "ml-20"
                } p-8 pt-20`}
            >
                {children}
            </div>
        </div>
    );
}
