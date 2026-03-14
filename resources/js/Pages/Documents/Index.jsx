import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import FloeLayout from "@/Layouts/FloeLayout";
import { usePermissions } from "@/Hooks/usePermissions";
import axios from "@/Services/axios";
import DocumentViewers from "./Partials/DocumentViewers";
import {
    FileText,
    Download,
    Eye,
    Search,
    Filter,
    ChevronDown,
    Grid3X3,
    List,
    X,
    Tag,
    Clock,
    ArrowUpDown,
    RefreshCw,
    Pencil,
} from "lucide-react";

export default function DocumentsIndex() {
    const { can, isAdmin, isContributor } = usePermissions();
    const { auth } = usePage().props;

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [filters, setFilters] = useState({
        search: "",
        category_id: "",
        tags: [],
        author_id: "",
        date: "",
        file_type: "",
        status: "",
        sort_by: "created_at",
        sort_order: "desc",
    });

    // State for viewers modal
    const [showViewersModal, setShowViewersModal] = useState(false);
    const [showDownloadsModal, setShowDownloadsModal] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchTags();
        if (isAdmin) fetchUsers();
        fetchDocuments();
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [filters]);

    const fetchDocuments = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (filters.search) params.append("search", filters.search);
            if (filters.category_id)
                params.append("category_id", filters.category_id);
            if (filters.tags.length > 0)
                params.append("tags", filters.tags.join(","));
            if (filters.author_id)
                params.append("author_id", filters.author_id);
            if (filters.date)
                // ← Une seule condition
                params.append("date", filters.date); // ← Envoie une seule date

            if (filters.file_type)
                params.append("file_type", filters.file_type);
            if (filters.status) params.append("status", filters.status);

            params.append("sort_by", filters.sort_by);
            params.append("sort_order", filters.sort_order);
            params.append("page", page);

            const response = await axios.get(
                `/web-api/documents?${params.toString()}`,
            );

            setDocuments(response.data.data || []);
            setPagination(
                response.data.meta || {
                    current_page: 1,
                    last_page: 1,
                    total: 0,
                },
            );
        } catch (error) {
            console.error("Erreur chargement documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/web-api/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Erreur chargement catégories:", error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await axios.get("/web-api/tags");
            setTags(response.data.data || []);
        } catch (error) {
            console.error("Erreur chargement tags:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/web-api/users");
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("Erreur chargement utilisateurs:", error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleTagToggle = (tagId) => {
        setFilters((prev) => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter((id) => id !== tagId)
                : [...prev.tags, tagId],
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            category_id: "",
            tags: [],
            author_id: "",
            date: "",
            file_type: "",
            status: "",
            sort_by: "created_at",
            sort_order: "desc",
        });
    };

    const handleSort = (field) => {
        setFilters((prev) => ({
            ...prev,
            sort_by: field,
            sort_order:
                prev.sort_by === field && prev.sort_order === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const handleDownload = (documentId) => {
        // Ouvrir l'endpoint Laravel qui sert directement le fichier.
        // Cela permet de travailler même si le lien storage/public n'est pas présent.
        window.open(`/web-api/documents/${documentId}/download`, "_blank");
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (fileType) => {
        const icons = {
            pdf: "📕",
            docx: "📘",
            xlsx: "📗",
            jpg: "🖼️",
            jpeg: "🖼️",
            png: "🖼️",
            txt: "📄",
        };
        return icons[fileType] || "📄";
    };

    const fileTypes = [
        { value: "", label: "Tous les types" },
        { value: "pdf", label: "PDF" },
        { value: "docx", label: "Word" },
        { value: "xlsx", label: "Excel" },
        { value: "jpg", label: "Image jpg" },
        { value: "jpeg", label: "Image jpeg" },
        { value: "png", label: "Image png" },
        { value: "txt", label: "Texte" },
    ];

    const statuses = [
        { value: "", label: "Tous les statuts" },
        { value: "active", label: "Actif" },
        { value: "archived", label: "Archivé" },
        { value: "draft", label: "Brouillon" },
    ];

    const canModifyDocument = (doc) => {
        return isAdmin || isContributor;
    };

    const getStatusStyle = (status) => {
        const styles = {
            active: {
                bg: "bg-green-100 dark:bg-green-900",
                text: "text-green-700 dark:text-green-300",
                label: "Actif",
            },
            archived: {
                bg: "bg-gray-100 dark:bg-gray-700",
                text: "text-gray-600 dark:text-gray-300",
                label: "Archivé",
            },
            draft: {
                bg: "bg-yellow-100 dark:bg-yellow-900",
                text: "text-yellow-700 dark:text-yellow-300",
                label: "Brouillon",
            },
        };
        return styles[status] || styles.draft;
    };

    return (
        <FloeLayout>
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Documents
                    </h1>
                    {can.uploadDocuments && (
                        <Link
                            href="/documents/upload"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
                        >
                            <FileText size={18} className="mr-2" />
                            Nouveau document
                        </Link>
                    )}
                </div>

                {/* Barre de recherche principale */}
                <div className="mt-6 flex gap-4">
                    <div className="flex-1 relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Rechercher par mot-clé..."
                            value={filters.search}
                            onChange={(e) =>
                                handleFilterChange("search", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 border rounded-lg flex items-center ${
                            showFilters
                                ? "bg-blue-50 dark:bg-blue-900 border-blue-300 text-blue-600 dark:text-blue-300"
                                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                        <Filter size={18} className="mr-2" />
                        Filtres
                        <ChevronDown
                            size={16}
                            className={`ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`}
                        />
                    </button>

                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg flex">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 ${viewMode === "grid" ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                            title="Vue grille"
                        >
                            <Grid3X3 size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 ${viewMode === "list" ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                            title="Vue liste"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Panneau de filtres avancés */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-700 dark:text-gray-200">
                                Filtres avancés
                            </h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center"
                            >
                                <RefreshCw size={14} className="mr-1" />
                                Réinitialiser
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Filtre par catégorie */}
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Catégorie
                                </label>
                                <select
                                    value={filters.category_id}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "category_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">
                                        Toutes les catégories
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre par auteur (admin seulement) */}
                            {isAdmin && (
                                <div>
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Auteur
                                    </label>
                                    <select
                                        value={filters.author_id}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "author_id",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Tous les auteurs
                                        </option>
                                        {users.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Filtre par type de fichier */}
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Type de fichier
                                </label>
                                <select
                                    value={filters.file_type}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "file_type",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {fileTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre par statut */}
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Statut
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "status",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {statuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre par date */}
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "date",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Filtre par tags */}
                        {tags.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() =>
                                                handleTagToggle(tag.id)
                                            }
                                            className={`px-3 py-1 rounded-full text-sm flex items-center ${
                                                filters.tags.includes(tag.id)
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                            style={
                                                !filters.tags.includes(tag.id)
                                                    ? {
                                                          backgroundColor:
                                                              tag.color + "20",
                                                      }
                                                    : {}
                                            }
                                        >
                                            <Tag size={12} className="mr-1" />
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Résumé des filtres actifs */}
                {(filters.search ||
                    filters.category_id ||
                    filters.tags.length > 0 ||
                    filters.author_id ||
                    filters.date ||
                    filters.file_type ||
                    filters.status) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                            Filtres actifs:
                        </span>
                        {filters.search && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center">
                                "{filters.search}"
                                <button
                                    onClick={() =>
                                        handleFilterChange("search", "")
                                    }
                                    className="ml-1"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {filters.category_id && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center">
                                Catégorie
                                <button
                                    onClick={() =>
                                        handleFilterChange("category_id", "")
                                    }
                                    className="ml-1"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {filters.tags.length > 0 && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center">
                                {filters.tags.length} tag(s)
                                <button
                                    onClick={() =>
                                        handleFilterChange("tags", [])
                                    }
                                    className="ml-1"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {filters.date && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center">
                                Date : {filters.date}
                                <button
                                    onClick={() =>
                                        handleFilterChange("date", "")
                                    }
                                    className="ml-1"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {filters.date && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center">
                                Date : {filters.date}
                                <button
                                    onClick={() =>
                                        handleFilterChange("date", "")
                                    }
                                    className="ml-1"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* En-tête de tableau pour la vue liste */}
            {viewMode === "list" && documents.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    <div
                        className="col-span-3 flex items-center cursor-pointer"
                        onClick={() => handleSort("title")}
                    >
                        Titre
                        {filters.sort_by === "title" && (
                            <ArrowUpDown
                                size={14}
                                className={`ml-1 ${filters.sort_order === "desc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </div>
                    <div className="col-span-1 flex items-center">Statut</div>
                    <div
                        className="col-span-2 flex items-center cursor-pointer"
                        onClick={() => handleSort("category_id")}
                    >
                        Catégorie
                    </div>
                    <div
                        className="col-span-1 flex items-center cursor-pointer"
                        onClick={() => handleSort("file_size")}
                    >
                        Taille
                        {filters.sort_by === "file_size" && (
                            <ArrowUpDown
                                size={14}
                                className={`ml-1 ${filters.sort_order === "desc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </div>
                    <div
                        className="col-span-1 flex items-center cursor-pointer"
                        onClick={() => handleSort("view_count")}
                    >
                        Vues
                        {filters.sort_by === "view_count" && (
                            <ArrowUpDown
                                size={14}
                                className={`ml-1 ${filters.sort_order === "desc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </div>
                    <div
                        className="col-span-1 flex items-center cursor-pointer"
                        onClick={() => handleSort("download_count")}
                    >
                        Tél.
                        {filters.sort_by === "download_count" && (
                            <ArrowUpDown
                                size={14}
                                className={`ml-1 ${filters.sort_order === "desc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </div>
                    <div
                        className="col-span-2 flex items-center cursor-pointer"
                        onClick={() => handleSort("created_at")}
                    >
                        Date
                        {filters.sort_by === "created_at" && (
                            <ArrowUpDown
                                size={14}
                                className={`ml-1 ${filters.sort_order === "desc" ? "rotate-180" : ""}`}
                            />
                        )}
                    </div>
                    <div className="col-span-1">Actions</div>
                </div>
            )}

            {/* Liste des documents */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : documents.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
                    <FileText
                        size={64}
                        className="mx-auto mb-4 text-gray-300"
                    />
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Aucun document trouvé
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {Object.values(filters).some((f) => f && f.length > 0)
                            ? "Essayez de modifier vos filtres de recherche"
                            : "Commencez par uploader votre premier document"}
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                // Vue en grille
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">
                                    {getFileIcon(doc.file_type)}
                                </div>
                                {canModifyDocument(doc) && (
                                    <div className="flex items-center space-x-1">
                                        <Link
                                            href={`/documents/${doc.id}/edit`}
                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil
                                                size={16}
                                                className="text-blue-600 dark:text-blue-400"
                                            />
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link href={`/documents/${doc.id}`}>
                                <h3 className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-2 line-clamp-2">
                                    {doc.title}
                                </h3>
                            </Link>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                {doc.category?.name || "Non catégorisé"} •{" "}
                                {formatFileSize(doc.file_size)}
                            </p>

                            {/* Affichage du statut */}
                            <div className="mb-3">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(doc.status).bg} ${getStatusStyle(doc.status).text}`}
                                >
                                    {getStatusStyle(doc.status).label}
                                </span>
                            </div>

                            {doc.tags && doc.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {doc.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="px-2 py-0.5 text-xs rounded-full"
                                            style={{
                                                backgroundColor:
                                                    tag.color + "20",
                                                color: tag.color,
                                            }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                    {doc.tags.length > 3 && (
                                        <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                            +{doc.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-3">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedDocumentId(doc.id);
                                        setShowViewersModal(true);
                                    }}
                                    className="flex items-center hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                    title="Voir les consultations"
                                >
                                    <Eye size={14} className="mr-1" />
                                    <span>{doc.view_count || 0}</span>
                                </button>
                                <div className="flex items-center">
                                    <Download size={14} className="mr-1" />
                                    <span
                                        className="hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
                                        title="Voir les téléchargements"
                                        onClick={() => {
                                            setSelectedDocumentId(doc.id);
                                            setShowDownloadsModal(true);
                                        }}
                                    >
                                        {doc.download_count || 0}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDownload(doc.id)}
                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                    title="Télécharger"
                                >
                                    <Download
                                        size={16}
                                        className="text-blue-600 dark:text-blue-400"
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Vue en liste
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3 flex items-center">
                                    <span className="text-2xl mr-3">
                                        {getFileIcon(doc.file_type)}
                                    </span>
                                    <div>
                                        <Link
                                            href={`/documents/${doc.id}`}
                                            className="font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            {doc.title}
                                        </Link>
                                        {doc.tags && doc.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {doc.tags
                                                    .slice(0, 2)
                                                    .map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="px-2 py-0.5 text-xs rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    tag.color +
                                                                    "20",
                                                                color: tag.color,
                                                            }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(doc.status).bg} ${getStatusStyle(doc.status).text}`}
                                    >
                                        {getStatusStyle(doc.status).label}
                                    </span>
                                </div>
                                <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300">
                                    {doc.category?.name || "-"}
                                </div>
                                <div className="col-span-1 text-sm text-gray-600 dark:text-gray-300">
                                    {formatFileSize(doc.file_size)}
                                </div>
                                <div className="col-span-1 text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedDocumentId(doc.id);
                                            setShowViewersModal(true);
                                        }}
                                        className="flex items-center hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        title="Voir les consultations"
                                    >
                                        <Eye
                                            size={14}
                                            className="mr-1 text-gray-400"
                                        />
                                        {doc.view_count || 0}
                                    </button>
                                </div>
                                <div className="col-span-1 text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                    <Download
                                        size={14}
                                        className="mr-1 text-gray-400"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedDocumentId(doc.id);
                                            setShowDownloadsModal(true);
                                        }}
                                        className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                        title="Voir les téléchargements"
                                    >
                                        {doc.download_count || 0}
                                    </button>
                                </div>
                                <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                    <Clock
                                        size={14}
                                        className="mr-1 text-gray-400"
                                    />
                                    {new Date(
                                        doc.created_at,
                                    ).toLocaleDateString()}
                                </div>
                                <div className="col-span-1 text-right flex items-center justify-end space-x-2">
                                    {canModifyDocument(doc) && (
                                        <>
                                            <Link
                                                href={`/documents/${doc.id}/edit`}
                                                className="inline-flex items-center p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Pencil
                                                    size={16}
                                                    className="text-blue-600 dark:text-blue-400"
                                                />
                                            </Link>
                                            <button
                                                onClick={() => handleDownload(doc.id)}
                                                className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                                                title="Télécharger"
                                            >
                                                <Download
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {doc.file_type?.toUpperCase() ||
                                                    "DL"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                        <button
                            onClick={() =>
                                fetchDocuments(pagination.current_page - 1)
                            }
                            disabled={pagination.current_page === 1}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                        >
                            Précédent
                        </button>

                        {[...Array(pagination.last_page)]
                            .map((_, i) => i + 1)
                            .filter(
                                (page) =>
                                    page === 1 ||
                                    page === pagination.last_page ||
                                    (page >= pagination.current_page - 2 &&
                                        page <= pagination.current_page + 2),
                            )
                            .map((page, index, array) => {
                                if (index > 0 && page > array[index - 1] + 1) {
                                    return (
                                        <React.Fragment
                                            key={`ellipsis-${page}`}
                                        >
                                            <span className="px-3 py-1 text-gray-500">
                                                ...
                                            </span>
                                            <button
                                                onClick={() =>
                                                    fetchDocuments(page)
                                                }
                                                className={`px-3 py-1 border rounded-lg ${
                                                    pagination.current_page ===
                                                    page
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => fetchDocuments(page)}
                                        className={`px-3 py-1 border rounded-lg ${
                                            pagination.current_page === page
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                        <button
                            onClick={() =>
                                fetchDocuments(pagination.current_page + 1)
                            }
                            disabled={
                                pagination.current_page === pagination.last_page
                            }
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                        >
                            Suivant
                        </button>
                    </nav>
                </div>
            )}

            {/* Modal - Liste des viewers */}
            <DocumentViewers
                documentId={selectedDocumentId}
                isOpen={showViewersModal}
                onClose={() => {
                    setShowViewersModal(false);
                    setSelectedDocumentId(null);
                }}
                type="view"
            />

            {/* Modal - Liste des téléchargements */}
            <DocumentViewers
                documentId={selectedDocumentId}
                isOpen={showDownloadsModal}
                onClose={() => {
                    setShowDownloadsModal(false);
                    setSelectedDocumentId(null);
                }}
                type="download"
            />
        </FloeLayout>
    );
}
