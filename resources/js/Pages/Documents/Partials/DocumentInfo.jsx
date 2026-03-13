// resources/js/Pages/Documents/Partials/DocumentInfo.jsx
import React from "react";
import {
    FileText,
    User,
    Calendar,
    Download,
    Eye,
    HardDrive,
} from "lucide-react";

export default function DocumentInfo({ document }) {
    // Formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Formater la taille
    const formatSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Obtenir l'icône selon le type de fichier
    const getFileIcon = () => {
        switch (document.file_type?.toLowerCase()) {
            case "pdf":
                return "📄";
            case "doc":
            case "docx":
                return "📝";
            case "xls":
            case "xlsx":
                return "📊";
            case "jpg":
            case "jpeg":
            case "png":
                return "🖼️";
            default:
                return "📁";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText size={20} className="mr-2 text-blue-500" />
                Informations générales
            </h2>

            <div className="space-y-4">
                {/* Titre */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {document.title}
                    </h3>
                    {document.description && (
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {document.description}
                        </p>
                    )}
                </div>

                {/* Grille d'informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Auteur */}
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Auteur</p>
                            <p className="text-sm font-medium text-gray-800">
                                {document.user?.name || "Inconnu"}
                            </p>
                        </div>
                    </div>

                    {/* Date d'upload */}
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Ajouté le</p>
                            <p className="text-sm font-medium text-gray-800">
                                {formatDate(document.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Type de fichier */}
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-3 text-lg">
                            {getFileIcon()}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">
                                Type de fichier
                            </p>
                            <p className="text-sm font-medium text-gray-800 uppercase">
                                {document.file_type}
                            </p>
                        </div>
                    </div>

                    {/* Taille */}
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mr-3">
                            <HardDrive size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Taille</p>
                            <p className="text-sm font-medium text-gray-800">
                                {formatSize(document.file_size)}
                            </p>
                        </div>
                    </div>

                    {/* Téléchargements */}
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-3">
                            <Download size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">
                                Téléchargements
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                                {document.download_count || 0} fois
                            </p>
                        </div>
                    </div>

                    {/* Vues */}
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mr-3">
                            <Eye size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">
                                Consultations
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                                {document.view_count || 0} fois
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statut (si admin ou contributeur) */}
                {document.status && document.status !== "active" && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            ${document.status === "approved" ? "bg-green-100 text-green-800" : ""}
                            ${document.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${document.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                            ${document.status === "archived" ? "bg-gray-100 text-gray-800" : ""}
                        `}
                        >
                            Statut : {document.status}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
