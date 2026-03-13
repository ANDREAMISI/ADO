import React, { useState, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, File, AlertCircle } from "lucide-react";
import axios from "@/Services/axios";
import { useToast } from "@/Hooks/useToast";

export default function DocumentPreview({ document }) {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scale, setScale] = useState(1);
    const [isOfficeFile, setIsOfficeFile] = useState(false);

    // Déterminer le type de fichier
    const fileType = document.file_type?.toLowerCase();
    const isPdf = fileType === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(fileType);
    const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType);
    const isText = fileType === 'txt';

    // URLs
    const previewUrl = `/web-api/documents/${document.id}/preview`;

    useEffect(() => {
        // Si c'est un fichier Office, on n'essaie même pas de charger
        if (isOffice) {
            setIsOfficeFile(true);
            setLoading(false);
        }
    }, [isOffice]);

    const handleIframeLoad = () => {
        setLoading(false);
    };

    const handleIframeError = () => {
        setLoading(false);
        setError("Impossible de charger l'aperçu");
        toast.error("Erreur de chargement du document");
    };

    const handleImageLoad = () => {
        setLoading(false);
    };

    const handleImageError = () => {
        setLoading(false);
        setError("Impossible de charger l'image");
        toast.error("Erreur de chargement de l'image");
    };

    const handleDownload = () => {
        window.open(`/web-api/documents/${document.id}/download`, "_blank");
    };

    const zoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 2));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const resetZoom = () => {
        setScale(1);
    };

    // Fonction pour obtenir l'icône selon le type de fichier
    const getFileIcon = () => {
        const iconSize = 64;
        if (fileType?.includes('doc')) return <FileText size={iconSize} className="text-blue-600" />;
        if (fileType?.includes('xls')) return <FileSpreadsheet size={iconSize} className="text-green-600" />;
        if (fileType?.includes('ppt')) return <FileText size={iconSize} className="text-orange-600" />;
        return <File size={iconSize} className="text-gray-600" />;
    };

    // Fonction pour obtenir le nom complet du type de fichier
    const getFileTypeName = () => {
        const types = {
            'doc': 'Document Word',
            'docx': 'Document Word',
            'xls': 'Tableur Excel',
            'xlsx': 'Tableur Excel',
            'ppt': 'Présentation PowerPoint',
            'pptx': 'Présentation PowerPoint'
        };
        return types[fileType] || fileType?.toUpperCase() || 'document';
    };

    // Rendu pour les fichiers Office (message avec grande icône)
    if (isOfficeFile) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
                {/* Barre d'outils */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                            Aperçu
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                            {fileType?.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                            Visualisation non disponible
                        </span>
                    </div>
                </div>

                {/* Message central avec grande icône */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                    {/* Grande icône animée */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                        <div className="relative bg-white rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                            {getFileIcon()}
                        </div>
                    </div>

                    {/* Titre */}
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                        Visualisation non disponible
                    </h3>

                    {/* Description */}
                    <div className="max-w-md text-center mb-8">
                        <p className="text-gray-600 text-lg mb-2">
                            Les fichiers <span className="font-semibold text-blue-600">{getFileTypeName()}</span> ne peuvent pas être affichés directement.
                        </p>
                        <p className="text-gray-500">
                            Pour des raisons techniques, veuillez télécharger le document pour visualiser son contenu.
                        </p>
                    </div>

                    {/* Bouton de téléchargement proéminent */}
                    <button
                        onClick={handleDownload}
                        className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                    >
                        <Download size={24} className="mr-3 group-hover:animate-bounce" />
                        <span className="text-lg font-semibold">Télécharger le document</span>
                    </button>

                    {/* Formats supportés */}
                    <p className="mt-8 text-sm text-gray-400 border-t border-gray-200 pt-6">
                        Formats disponibles pour visualisation directe : PDF, JPG, PNG, GIF
                    </p>
                </div>
            </div>
        );
    }

    // Rendu pour les types supportés (PDF, images, texte)
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
            {/* Barre d'outils */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                        Aperçu
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                        {fileType?.toUpperCase()}
                    </span>
                </div>

                {/* Contrôles de zoom - seulement pour PDF et images */}
                {(isPdf || isImage) && (
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={zoomOut}
                            disabled={scale <= 0.5}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom arrière"
                        >
                            <span className="text-lg font-bold">−</span>
                        </button>
                        <button
                            onClick={resetZoom}
                            className="px-2 py-1 text-xs hover:bg-gray-200 rounded"
                            title="Taille réelle"
                        >
                            {Math.round(scale * 100)}%
                        </button>
                        <button
                            onClick={zoomIn}
                            disabled={scale >= 2}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom avant"
                        >
                            <span className="text-lg font-bold">+</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Zone d'aperçu */}
            <div className="flex-1 bg-gray-100 overflow-auto relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Chargement du document...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-8">
                        <AlertCircle size={48} className="text-red-500 mb-4" />
                        <p className="text-gray-600 mb-4 text-center">{error}</p>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <Download size={16} className="mr-2" />
                            Télécharger le document
                        </button>
                    </div>
                )}

                {/* PDF */}
                {isPdf && !error && (
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                        title={`Aperçu de ${document.title}`}
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "top left",
                            width: scale > 1 ? `${100 / scale}%` : "100%",
                            height: scale > 1 ? `${100 / scale}%` : "100%",
                        }}
                    />
                )}

                {/* Images */}
                {isImage && !error && (
                    <img
                        src={previewUrl}
                        alt={document.title}
                        className="max-w-full max-h-full object-contain"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{ 
                            transform: `scale(${scale})`,
                            transition: 'transform 0.2s ease'
                        }}
                    />
                )}

                {/* Texte */}
                {isText && !error && (
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                        title={`Aperçu de ${document.title}`}
                    />
                )}
            </div>
        </div>
    );
}