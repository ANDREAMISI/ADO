import React, { useState, useEffect } from "react";
import {
    History,
    Upload,
    Eye,
    Download,
    Edit,
    Trash2,
    User,
} from "lucide-react";
import axios from "@/Services/axios";
import { usePage } from "@inertiajs/react";

export default function DocumentHistory({ document }) {
    const { auth } = usePage().props;
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = !!auth?.user;

    useEffect(() => {
        if (isLoggedIn) {
            fetchHistory();
        }
    }, [document.id, isLoggedIn]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/web-api/documents/${document.id}/history`,
            );
            setHistory(response.data.history || []);
        } catch (error) {
            console.error("Erreur chargement historique:", error);
        } finally {
            setLoading(false);
        }
    };

    // Formater la date relative (il y a X minutes, etc.)
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return "à l'instant";
        if (diffMin < 60)
            return `il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
        if (diffHour < 24)
            return `il y a ${diffHour} heure${diffHour > 1 ? "s" : ""}`;
        if (diffDay < 7)
            return `il y a ${diffDay} jour${diffDay > 1 ? "s" : ""}`;

        return date.toLocaleDateString("fr-FR");
    };

    // Obtenir l'icône selon l'action
    const getActionIcon = (action) => {
        switch (action) {
            case "upload":
                return <Upload size={16} className="text-green-600" />;
            case "view":
                return <Eye size={16} className="text-blue-600" />;
            case "download":
                return <Download size={16} className="text-purple-600" />;
            case "edit":
                return <Edit size={16} className="text-orange-600" />;
            case "delete":
                return <Trash2 size={16} className="text-red-600" />;
            default:
                return <History size={16} className="text-gray-600" />;
        }
    };

    // Ne rien afficher si pas connecté
    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <History size={20} className="mr-2 text-purple-500" />
                Historique des accès
            </h2>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <History size={40} className="mx-auto mb-3 text-gray-300" />
                    <p>Aucun historique disponible</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item, index) => (
                        <div key={index} className="flex items-start">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                {getActionIcon(item.action)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-800">
                                        {item.description}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {formatRelativeTime(item.created_at)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                    <User size={12} className="mr-1" />
                                    {item.user_name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
