import React, { useState, useEffect } from "react";
import { Eye, Download, X, User, Mail, Clock, Loader2 } from "lucide-react";
import axios from "@/Services/axios";

export default function DocumentViewers({
    documentId,
    isOpen,
    onClose,
    type = "view",
}) {
    const [viewers, setViewers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && documentId) {
            fetchViewers();
        }
    }, [isOpen, documentId, type]);

    const fetchViewers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `/web-api/documents/${documentId}/viewers?type=${type}`,
            );
            setViewers(response.data.viewers || []);
        } catch (err) {
            console.error("Erreur chargement:", err);
            setError("Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return "À l'instant";
        if (diffMin < 60)
            return `Il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
        if (diffHour < 24)
            return `Il y a ${diffHour} heure${diffHour > 1 ? "s" : ""}`;
        if (diffDay < 7)
            return `Il y a ${diffDay} jour${diffDay > 1 ? "s" : ""}`;

        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (email) => {
        if (!email) return "bg-gray-500";
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-red-500",
            "bg-yellow-500",
            "bg-teal-500",
        ];
        const index = email.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (!isOpen) return null;

    const title =
        type === "download"
            ? "Téléchargements du document"
            : "Consultations du document";
    const icon =
        type === "download" ? (
            <Download className="w-5 h-5 text-green-500 mr-2" />
        ) : (
            <Eye className="w-5 h-5 text-blue-500 mr-2" />
        );
    const emptyMessage =
        type === "download"
            ? "Aucun téléchargement enregistré"
            : "Aucune consultation enregistrée";
    const footerMessage =
        type === "download"
            ? `${viewers.length} téléchargement${viewers.length > 1 ? "s" : ""} enregistré${viewers.length > 1 ? "s" : ""}`
            : `${viewers.length} consultation${viewers.length > 1 ? "s" : ""} enregistrée${viewers.length > 1 ? "s" : ""}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <div className="flex items-center">
                        {icon}
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="px-6 py-8 text-center">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : viewers.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            {type === "download" ? (
                                <Download className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            ) : (
                                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            )}
                            <p className="text-gray-500 dark:text-gray-400">
                                {emptyMessage}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y dark:divide-gray-700">
                            {viewers.map((viewer) => (
                                <div
                                    key={viewer.id}
                                    className="px-6 py-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    {viewer.user_avatar ? (
                                        <img
                                            src={viewer.user_avatar}
                                            alt={viewer.user_name}
                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                        />
                                    ) : (
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white text-sm font-medium ${getAvatarColor(viewer.user_email)}`}
                                        >
                                            {getInitials(viewer.user_name)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <User className="w-3 h-3 text-gray-400 mr-1" />
                                            <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                {viewer.user_name ||
                                                    "Utilisateur inconnu"}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            <Mail className="w-3 h-3 mr-1" />
                                            <span className="truncate">
                                                {viewer.user_email}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400 ml-3">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span className="whitespace-nowrap">
                                            {formatRelativeTime(
                                                viewer.viewed_at,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {viewers.length > 0
                            ? footerMessage
                            : "Soyez le premier à effectuer cette action!"}
                    </p>
                </div>
            </div>
        </div>
    );
}
