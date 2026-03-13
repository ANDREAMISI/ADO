// resources/js/Pages/Documents/Show.jsx
import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { usePermissions } from "@/Hooks/usePermissions";
import axios from "@/Services/axios";
import DocumentInfo from "./Partials/DocumentInfo";
import DocumentTags from "./Partials/DocumentTags";
import DocumentPreview from "./Partials/DocumentPreview";
import DocumentHistory from "./Partials/DocumentHistory";
import { ArrowLeft, Download, Edit, Trash2 } from "lucide-react";

export default function DocumentShow({ id }) {
    const { can, isAdmin, isContributor } = usePermissions();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = async () => {
        try {
            const response = await axios.get(`/web-api/documents/${id}`);
            setDocument(response.data.document || response.data);
        } catch (err) {
            console.error("Erreur chargement document:", err);
            setError("Impossible de charger le document");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.open(`/web-api/documents/${id}/download`, "_blank");
    };

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
            return;
        }

        try {
            await axios.delete(`/web-api/documents/${id}`);
            window.location.href = "/documents";
        } catch (err) {
            console.error("Erreur suppression:", err);
            alert("Erreur lors de la suppression");
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AppLayout>
        );
    }

    if (error || !document) {
        return (
            <AppLayout>
                <div className="text-center py-12">
                    <p className="text-red-600">
                        {error || "Document non trouvé"}
                    </p>
                    <Link
                        href="/documents"
                        className="text-blue-600 hover:underline mt-4 inline-block"
                    >
                        Retour à la liste
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const canEdit =
        isAdmin ||
        (isContributor && document.user_id === usePage().props.auth.user?.id);

    return (
        <AppLayout>
            {/* En-tête avec navigation et actions */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Link
                        href="/documents"
                        className="p-2 hover:bg-gray-100 rounded-lg mr-4"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {document.title}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {document.category?.name} •{" "}
                            {document.file_type?.toUpperCase()} •{" "}
                            {document.file_size_formatted}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-sm hover:shadow transition-all"
                    >
                        <Download size={18} className="mr-2" />
                        Télécharger
                    </button>

                    {canEdit && (
                        <Link
                            href={`/documents/${id}/edit`}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center shadow-sm hover:shadow transition-all"
                        >
                            <Edit size={18} className="mr-2" />
                            Modifier
                        </Link>
                    )}
                </div>
            </div>

            {/* Contenu principal - 2 colonnes comme Google Drive */}
            <div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                style={{ height: "calc(100vh - 200px)" }}
            >
                {/* Colonne gauche (8/12) - APERÇU DU DOCUMENT (plus grand) */}
                <div className="lg:col-span-8 h-full">
                    <DocumentPreview document={document} />
                </div>

                {/* Colonne droite (4/12) - INFORMATIONS (plus étroit) */}
                <div className="lg:col-span-4 h-full overflow-y-auto pr-2 space-y-6">
                    <DocumentInfo document={document} />
                    <DocumentTags document={document} />
                    <DocumentHistory document={document} />
                </div>
            </div>
        </AppLayout>
    );
}
