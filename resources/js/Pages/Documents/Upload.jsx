import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Link, router, usePage } from "@inertiajs/react";
import ModernLayout from "@/Layouts/ModernLayout";
import axios from "@/Services/axios";
import { useToast } from "@/Hooks/useToast";
import toast from "react-hot-toast";
import {
    Upload,
    FileText,
    X,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Save,
    Tag,
} from "lucide-react";

export default function DocumentUpload() {
    const toastHook = useToast();
    const { auth } = usePage().props;
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (!auth.user) {
            toastHook.warning(
                "Vous devez être connecté pour uploader des documents",
            );
            router.visit("/login");
            return;
        }

        fetchCategories();
        fetchTags();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/web-api/categories");
            setCategories(response.data || []);
        } catch (error) {
            toastHook.error("Erreur lors du chargement des catégories");
            console.error("Erreur chargement catégories:", error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await axios.get("/web-api/tags");
            setTags(response.data.data || []);
        } catch (error) {
            toastHook.error("Erreur lors du chargement des tags");
            console.error("Erreur chargement tags:", error);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                toastHook.error("Le fichier ne doit pas dépasser 10MB");
                return;
            }
            setFile(file);
            toastHook.success(`Fichier "${file.name}" sélectionné`);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            "text/plain": [".txt"],
        },
        maxSize: 10 * 1024 * 1024,
        onDropRejected: (rejectedFiles) => {
            const error = rejectedFiles[0]?.errors[0];
            if (error?.code === "file-too-large") {
                toastHook.error("Fichier trop volumineux (max 10MB)");
            } else if (error?.code === "file-invalid-type") {
                toastHook.error("Type de fichier non supporté");
            } else {
                toastHook.error("Erreur lors de la sélection du fichier");
            }
        },
    });

    const removeFile = () => {
        setFile(null);
        setUploadProgress(0);
        toastHook.info("Fichier retiré");
    };

    const toggleTag = (tagId) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId],
        );
    };

    const onSubmit = async (data) => {
        if (!file) {
            toastHook.info("Veuillez sélectionner un fichier");
            return;
        }

        if (!auth.user) {
            toastHook.warning("Vous devez être connecté");
            router.visit("/login");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("category_id", data.category_id);

        selectedTags.forEach((tagId) => {
            formData.append("tags[]", tagId);
        });

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        if (!csrfToken) {
            toastHook.error("Erreur de sécurité. Rechargez la page.");
            return;
        }

        setUploading(true);

        // SOLUTION: Utiliser un ID fixe pour le toast
        toast.loading("Upload en cours...", { id: "upload-status" });

        try {
            const response = await axios.post("/web-api/documents", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-CSRF-TOKEN": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    setUploadProgress(percentCompleted);

                    // Mettre à jour le toast avec la progression
                    toast.loading(`Upload en cours... ${percentCompleted}%`, {
                        id: "upload-status",
                    });
                },
            });

            // Succès
            toast.success(`Document "${data.title}" uploadé avec succès !`, {
                id: "upload-status",
            });

            // Redirection
            setTimeout(() => {
                router.visit("/documents");
            }, 1500);
        } catch (error) {
            console.error("Erreur upload détaillée:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });

            // Gestion des erreurs
            if (error.response?.status === 419) {
                toast.error("Session expirée. Rechargement...", {
                    id: "upload-status",
                });
                setTimeout(() => window.location.reload(), 2000);
            } else if (error.response?.status === 401) {
                toast.error("Session expirée. Redirection...", {
                    id: "upload-status",
                });
                setTimeout(() => router.visit("/login"), 2000);
            } else if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0]?.[0];
                toast.error(firstError || "Données invalides", {
                    id: "upload-status",
                });
            } else {
                toast.error(
                    error.response?.data?.message || "Erreur lors de l'upload",
                    { id: "upload-status" },
                );
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <ModernLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center">
                    <Link
                        href="/documents"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-4"
                    >
                        <ArrowLeft
                            size={20}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Uploader un document
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Zone de drop */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                ${isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"}
                                ${file ? "bg-green-50 dark:bg-green-900/20 border-green-500" : ""}`}
                        >
                            <input {...getInputProps()} />

                            {file ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                                            <CheckCircle
                                                size={24}
                                                className="text-green-600 dark:text-green-400"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile();
                                        }}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                                        title="Retirer le fichier"
                                    >
                                        <X
                                            size={20}
                                            className="text-red-600 dark:text-red-400"
                                        />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Upload
                                        size={48}
                                        className="mx-auto mb-4 text-gray-400"
                                    />
                                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                        {isDragActive
                                            ? "Déposez le fichier ici"
                                            : "Glissez-déposez un fichier"}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        ou cliquez pour sélectionner
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max
                                        10MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Barre de progression */}
                        {uploading && (
                            <div className="mt-6">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Upload en cours...
                                    </span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {uploadProgress}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Champs du formulaire */}
                        <div className="mt-8 space-y-6">
                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Titre du document{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("title", {
                                        required: "Le titre est requis",
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                        ${errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"} dark:bg-gray-700 dark:text-white`}
                                    placeholder="Ex: Rapport annuel 2024"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <AlertCircle
                                            size={14}
                                            className="mr-1"
                                        />
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Description du document..."
                                />
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Catégorie{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("category_id", {
                                        required: "La catégorie est requise",
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                        ${errors.category_id ? "border-red-500" : "border-gray-300 dark:border-gray-600"} dark:bg-gray-700 dark:text-white`}
                                >
                                    <option value="">
                                        Sélectionnez une catégorie
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <AlertCircle
                                            size={14}
                                            className="mr-1"
                                        />
                                        {errors.category_id.message}
                                    </p>
                                )}
                            </div>

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() =>
                                                    toggleTag(tag.id)
                                                }
                                                className={`px-3 py-1 rounded-full text-sm flex items-center transition-all
                                                    ${
                                                        selectedTags.includes(
                                                            tag.id,
                                                        )
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    }`}
                                                style={
                                                    !selectedTags.includes(
                                                        tag.id,
                                                    )
                                                        ? {
                                                              backgroundColor:
                                                                  tag.color +
                                                                  "20",
                                                          }
                                                        : {}
                                                }
                                            >
                                                <Tag
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Boutons d'action */}
                        <div className="mt-8 flex justify-end space-x-3">
                            <Link
                                href="/documents"
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Upload en cours...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} className="mr-2" />
                                        Publier le document
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModernLayout>
    );
}
