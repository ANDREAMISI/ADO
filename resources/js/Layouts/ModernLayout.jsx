// resources/js/Layouts/ModernLayout.jsx
import { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { usePermissions } from "@/Hooks/usePermissions";
import { useDarkMode } from "@/Hooks/useDarkMode";
import axios from "axios";
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
    Star,
    Clock,
    Users,
    BarChart3,
    Download,
    Eye,
    Filter,
    Sun,
    Moon,
} from "lucide-react";

export default function ModernLayout({ children }) {
    const { user, can, isAdmin, isContributor, isReader } = usePermissions(); // Ajout des rôles
    const { theme, toggleTheme, isDark } = useDarkMode();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [notifications, setNotifications] = useState({ count: 0, has_notifications: false });

    // Fetch notifications on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/web-api/notifications');
                setNotifications(response.data);
            } catch (error) {
                console.error('Erreur chargement notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    // Fonction de déconnexion avec Inertia
    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    // Fonction de recherche
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            try {
                const response = await axios.get(
                    `/web-api/documents?search=${query}`,
                );
                setSearchResults(response.data.data || []);
                setShowSearchResults(true);
            } catch (error) {
                console.error("Erreur recherche:", error);
            }
        } else {
            setShowSearchResults(false);
        }
    };

    // Configuration dynamique selon le rôle
    const getRoleConfig = () => {
        if (isAdmin) {
            return {
                roleName: "Administrateur",
                roleColor: "red",
                documentFolders: [
                    { name: "Contrats", items: 12, show: true },
                    { name: "Factures", items: 24, show: true },
                    { name: "Rapports annuels", items: 8, show: true },
                    { name: "Documents sensibles", items: 5, show: true },
                ],
                mainNavigation: [
                    { name: "Dashboard", href: "/dashboard", icon: Home, color: "blue", show: true },
                    { name: "Tous les documents", href: "/documents", icon: FileText, color: "green", show: true },
                    { name: "Upload", href: "/documents/upload", icon: Upload, color: "purple", show: true },
                    { name: "Catégories", href: "/categories", icon: FolderTree, color: "orange", show: true },
                    { name: "Tags", href: "/tags", icon: Tags, color: "pink", show: true },
                    { name: "Utilisateurs", href: "/users", icon: Users, color: "indigo", show: true },
                    { name: "Statistiques", href: "/stats", icon: BarChart3, color: "yellow", show: true },
                ],
                quickAccess: [
                    { name: "Documents récents", href: "/documents?sort=recent", icon: Clock, color: "blue", show: true },
                    { name: "Les plus consultés", href: "/documents?sort=views", icon: Eye, color: "green", show: true },
                    { name: "Demandes d'accès", href: "/admin/access-requests", icon: Users, color: "red", show: true },
                    { name: "Logs d'accès", href: "/access-logs", icon: History, color: "gray", show: true },
                ]
            };
        } else if (isContributor) {
            return {
                roleName: "Contributeur",
                roleColor: "blue",
                documentFolders: [
                    { name: "Contrats", items: 12, show: true },
                    { name: "Factures", items: 24, show: true },
                    { name: "Rapports annuels", items: 8, show: true },
                ],
                mainNavigation: [
                    { name: "Dashboard", href: "/dashboard", icon: Home, color: "blue", show: true },
                    { name: "Tous les documents", href: "/documents", icon: FileText, color: "green", show: true },
                    { name: "Upload", href: "/documents/upload", icon: Upload, color: "purple", show: true },
                    { name: "Catégories", href: "/categories", icon: FolderTree, color: "orange", show: true },
                    { name: "Tags", href: "/tags", icon: Tags, color: "pink", show: true },
                ],
                quickAccess: [
                    { name: "Documents récents", href: "/documents?sort=recent", icon: Clock, color: "blue", show: true },
                    { name: "Les plus consultés", href: "/documents?sort=views", icon: Eye, color: "green", show: true },
                    { name: "Mes documents", href: "/documents?filter=mine", icon: User, color: "purple", show: true },
                ]
            };
        } else {
            // Reader
            return {
                roleName: "Lecteur",
                roleColor: "green",
                documentFolders: [
                    { name: "Contrats", items: 12, show: true },
                    { name: "Factures", items: 24, show: true },
                    { name: "Rapports annuels", items: 8, show: true },
                ],
                mainNavigation: [
                    { name: "Dashboard", href: "/dashboard", icon: Home, color: "blue", show: true },
                    { name: "Tous les documents", href: "/documents", icon: FileText, color: "green", show: true },
                    { name: "Catégories", href: "/categories", icon: FolderTree, color: "orange", show: true },
                    { name: "Tags", href: "/tags", icon: Tags, color: "pink", show: true },
                ],
                quickAccess: [
                    { name: "Documents récents", href: "/documents?sort=recent", icon: Clock, color: "blue", show: true },
                    { name: "Les plus consultés", href: "/documents?sort=views", icon: Eye, color: "green", show: true },
                    { name: "Favoris", href: "/documents?favorites=true", icon: Star, color: "yellow", show: true },
                ]
            };
        }
    };

    const roleConfig = getRoleConfig();

    // Dossiers documentaires selon le rôle
    const documentFolders = roleConfig.documentFolders.filter((f) => f.show);

    // Navigation principale selon le rôle
    const mainNavigation = roleConfig.mainNavigation.filter((w) => w.show);

    // Accès rapides selon le rôle
    const quickAccess = roleConfig.quickAccess.filter((w) => w.show);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Ajoute le Toaster ici - il sera global */}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Durée par défaut
                    duration: 4000,
                    // Styles par défaut
                    style: {
                        background: "#363636",
                        color: "#fff",
                        padding: "16px",
                        borderRadius: "10px",
                        fontSize: "14px",
                    },
                    // Options par type
                    success: {
                        duration: 3000,
                        style: {
                            background: "#10b981",
                            color: "#fff",
                        },
                        icon: "✅",
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: "#ef4444",
                            color: "#fff",
                        },
                        icon: "❌",
                    },
                    loading: {
                        duration: Infinity,
                        style: {
                            background: "#3b82f6",
                            color: "#fff",
                        },
                    },
                }}
            />

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
                            {isAdmin && (
                                <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 px-2 py-0.5 rounded-full">
                                    Admin
                                </span>
                            )}
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

                {/* Dossiers documentaires */}
                {sidebarOpen && documentFolders.length > 0 && (
                    <div className="px-4 py-4">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Mes dossiers
                        </h2>
                        <div className="space-y-2">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-200">
                                        Documents
                                    </span>
                                    <span className="text-xs bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                        {documentFolders.reduce(
                                            (acc, f) => acc + f.items,
                                            0,
                                        )}{" "}
                                        total
                                    </span>
                                </div>
                                <div className="mt-2 space-y-2">
                                    {documentFolders.map((folder, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between text-xs pl-2"
                                        >
                                            <span className="text-gray-600 dark:text-gray-300">
                                                {folder.name}
                                            </span>
                                            <span className="text-gray-400 dark:text-gray-500">
                                                {folder.items} docs
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation principale */}
                <div className="flex-1 overflow-y-auto px-4">
                    {sidebarOpen && mainNavigation.length > 0 && (
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Navigation
                        </h2>
                    )}
                    <nav className="space-y-1">
                        {mainNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${
                                    sidebarOpen ? "" : "justify-center"
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${item.color}-100 text-${item.color}-600 dark:bg-${item.color}-900/30 dark:text-${item.color}-400`}
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

                    {/* Accès rapides */}
                    {sidebarOpen && quickAccess.length > 0 && (
                        <>
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
                                Accès rapides
                            </h2>
                            <div className="space-y-2">
                                {quickAccess.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 bg-${item.color}-100 text-${item.color}-600 dark:bg-${item.color}-900/30 dark:text-${item.color}-400`}
                                        >
                                            <item.icon size={14} />
                                        </div>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* User Profile */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="relative">
                        <button
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            {sidebarOpen && (
                                <>
                                    <div className="ml-3 flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                            {isAdmin
                                                ? "Administrateur"
                                                : user?.roles?.[0] ===
                                                    "contributor"
                                                  ? "Contributeur"
                                                  : "Lecteur"}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar avec recherche avancée */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 relative">
                    <div className="flex-1 flex items-center">
                        <div className="relative w-96 hidden">
                            <Search
                                size={18}
                                className="absolute left-3 top-2.5 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Rechercher un document par mot-clé, catégorie, auteur..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* Résultats de recherche */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                                    {searchResults.map((doc) => (
                                        <Link
                                            key={doc.id}
                                            href={`/documents/${doc.id}`}
                                            className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0 dark:border-gray-700"
                                            onClick={() =>
                                                setShowSearchResults(false)
                                            }
                                        >
                                            <FileText
                                                size={16}
                                                className="mr-3 text-gray-400"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    {doc.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {doc.category?.name} •{" "}
                                                    {new Date(
                                                        doc.created_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Dark/Light Mode Toggle */}
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
                        {/* Notifications */}
                        <button 
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
                            onClick={() => {
                                if (isAdmin) {
                                    router.visit('/admin/access-requests');
                                }
                            }}
                        >
                            <Bell
                                size={18}
                                className="text-gray-600 dark:text-gray-300"
                            />
                            {notifications.has_notifications && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {roleConfig.roleName}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                {user?.name?.charAt(0) || "U"}
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
