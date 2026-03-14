import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import FloeLayout from "@/Layouts/FloeLayout";
import { usePermissions } from "@/Hooks/usePermissions";
import axios from "@/Services/axios";
import {
    FileText,
    FolderTree,
    Tags,
    Download,
    Eye,
    Clock,
    ChevronRight,
    Users,
    Upload,
    Activity,
    User,
    Star,
    Inbox,
    AlertCircle,
} from "lucide-react";

export default function Dashboard() {
    const { user, can, isAdmin, isContributor, isReader } = usePermissions();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [myDocuments, setMyDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Stats générales (accessibles à tous)
            const statsRes = await axios.get("/web-api/stats");
            setStats(statsRes.data);

            // Documents récents (accessibles à tous)
            const recentRes = await axios.get("/web-api/documents?per_page=5");
            setRecent(recentRes.data.data || []);

            // Mes documents (pour contributeur et admin)
            if (isContributor || isAdmin) {
                const myDocsRes = await axios.get(
                    "/web-api/documents?per_page=5&filter=mine",
                );
                setMyDocuments(myDocsRes.data.data || []);
            }
        } catch (error) {
            console.error("Erreur chargement données:", error);
        } finally {
            setLoading(false);
        }
    };

    // Statistiques adaptées au rôle
    const getStats = () => {
        const baseStats = [
            {
                name: "Documents",
                value: stats?.total_documents || 0,
                icon: FileText,
                color: "blue",
                bgColor: "bg-blue-100 dark:bg-blue-900",
                textColor: "text-blue-600 dark:text-blue-400",
                show: true,
            },
            {
                name: "Catégories",
                value: stats?.total_categories || 0,
                icon: FolderTree,
                color: "green",
                bgColor: "bg-green-100 dark:bg-green-900",
                textColor: "text-green-600 dark:text-green-400",
                show: true,
            },
            {
                name: "Tags",
                value: stats?.total_tags || 0,
                icon: Tags,
                color: "purple",
                bgColor: "bg-purple-100 dark:bg-purple-900",
                textColor: "text-purple-600 dark:text-purple-400",
                show: true,
            },
        ];

        // Stats supplémentaires pour admin
        if (isAdmin) {
            baseStats.push({
                name: "Utilisateurs",
                value: stats?.total_users || 0,
                icon: Users,
                color: "orange",
                bgColor: "bg-orange-100 dark:bg-orange-900",
                textColor: "text-orange-600 dark:text-orange-400",
                show: true,
            });
        }

        return baseStats.filter((stat) => stat.show);
    };

    // Actions rapides adaptées au rôle
    const getQuickActions = () => {
        const actions = [];

        // Admin peut tout faire
        if (isAdmin) {
            actions.push(
                {
                    name: "Uploader",
                    icon: Upload,
                    href: "/documents/upload",
                    color: "bg-blue-500",
                    description: "Ajouter un document",
                },
                {
                    name: "Nouvelle catégorie",
                    icon: FolderTree,
                    href: "/categories",
                    color: "bg-green-500",
                    description: "Créer une catégorie",
                },
                {
                    name: "Nouveau tag",
                    icon: Tags,
                    href: "/tags",
                    color: "bg-purple-500",
                    description: "Créer un tag",
                },
                {
                    name: "Gérer utilisateurs",
                    icon: Users,
                    href: "/users",
                    color: "bg-orange-500",
                    description: "Administration",
                },
            );
        }
        // Contributeur peut uploader et créer des tags
        else if (isContributor) {
            actions.push(
                {
                    name: "Uploader",
                    icon: Upload,
                    href: "/documents/upload",
                    color: "bg-blue-500",
                    description: "Ajouter un document",
                },
                {
                    name: "Nouveau tag",
                    icon: Tags,
                    href: "/tags",
                    color: "bg-purple-500",
                    description: "Créer un tag",
                },
            );
        }
        // Lecteur voit seulement des actions de consultation
        else {
            actions.push(
                {
                    name: "Explorer",
                    icon: FileText,
                    href: "/documents",
                    color: "bg-gray-500",
                    description: "Voir tous les documents",
                },
                {
                    name: "Catégories",
                    icon: FolderTree,
                    href: "/categories",
                    color: "bg-gray-500",
                    description: "Parcourir par catégorie",
                },
                {
                    name: "Tags",
                    icon: Tags,
                    href: "/tags",
                    color: "bg-gray-500",
                    description: "Parcourir par tag",
                },
            );
        }

        return actions;
    };

    // Messages de bienvenue personnalisés
    const getWelcomeMessage = () => {
        if (isAdmin) {
            return {
                title: `Bonjour ${user?.name}`,
                subtitle: "Voici l'aperçu de votre espace d'administration",
                icon: "!",
            };
        } else if (isContributor) {
            return {
                title: `Bonjour ${user?.name}`,
                subtitle: "Gérez vos documents et contributions",
                icon: "📝",
            };
        } else {
            return {
                title: `Bienvenue ${user?.name}`,
                subtitle: "Consultez les documents mis à votre disposition",
                icon: "!",
            };
        }
    };

    const stats_data = getStats();
    const quickActions = getQuickActions();
    const welcome = getWelcomeMessage();

    if (loading) {
        return (
            <FloeLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </FloeLayout>
        );
    }

    return (
        <FloeLayout>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {welcome.title} {welcome.icon}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {welcome.subtitle}
                </p>
            </div>

            {/* Stats Grid - Adapté au rôle */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats_data.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`p-2 ${stat.bgColor} rounded-lg`}
                                >
                                    <Icon
                                        size={20}
                                        className={stat.textColor}
                                    />
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {stat.name}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions - Adaptées au rôle */}
            {quickActions.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Actions rapides
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex items-center group"
                            >
                                <div
                                    className={`${action.color} p-3 rounded-lg text-white mr-4`}
                                >
                                    <action.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800 dark:text-white">
                                        {action.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {action.description}
                                    </p>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Documents récents (tout le monde) */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                            <Clock size={18} className="mr-2 text-blue-500" />
                            Documents récents
                        </h2>
                        <Link
                            href="/documents"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center"
                        >
                            Voir tout{" "}
                            <ChevronRight size={14} className="ml-1" />
                        </Link>
                    </div>

                    {recent.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <FileText
                                size={40}
                                className="mx-auto mb-3 text-gray-300"
                            />
                            <p>Aucun document récent</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recent.slice(0, 4).map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <Link
                                                href={`/documents/${doc.id}`}
                                                className="text-sm font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                {doc.title}
                                            </Link>
                                            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                <span>
                                                    {doc.category?.name ||
                                                        "Non catégorisé"}
                                                </span>
                                                <span className="mx-2">•</span>
                                                <Eye
                                                    size={10}
                                                    className="mr-1"
                                                />
                                                {doc.view_count || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mes documents (pour contributeur et admin) */}
                {(isContributor || isAdmin) && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                                <User
                                    size={18}
                                    className="mr-2 text-green-500"
                                />
                                Mes documents
                            </h2>
                            <Link
                                href="/documents?filter=mine"
                                className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 flex items-center"
                            >
                                Voir tout{" "}
                                <ChevronRight size={14} className="ml-1" />
                            </Link>
                        </div>

                        {myDocuments.length === 0 ? (
                            <div className="text-center py-8">
                                <Upload
                                    size={40}
                                    className="mx-auto mb-3 text-gray-300"
                                />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Vous n'avez pas encore uploadé de document
                                </p>
                                {can.uploadDocuments && (
                                    <Link
                                        href="/documents/upload"
                                        className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                    >
                                        Uploader maintenant
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myDocuments.slice(0, 4).map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/documents/${doc.id}`}
                                                    className="text-sm font-medium text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-400"
                                                >
                                                    {doc.title}
                                                </Link>
                                                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    <span>
                                                        {doc.category?.name ||
                                                            "Non catégorisé"}
                                                    </span>
                                                    <span className="mx-2">
                                                        •
                                                    </span>
                                                    <Download
                                                        size={10}
                                                        className="mr-1"
                                                    />
                                                    {doc.download_count || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pour lecteur : section d'activité récente à la place */}
                {isReader && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-6">
                            <Activity
                                size={18}
                                className="mr-2 text-purple-500"
                            />
                            Activité récente
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                    <Upload size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800 dark:text-white">
                                        3 nouveaux documents ajoutés
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Il y a 2 heures
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                                    <FolderTree size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800 dark:text-white">
                                        Nouvelle catégorie "Rapports"
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Il y a 1 jour
                                    </p>
                                </div>   
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FloeLayout>
    );
}
