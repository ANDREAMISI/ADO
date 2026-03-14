import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import FloeLayout from "@/Layouts/FloeLayout";
import { usePermissions } from "@/Hooks/usePermissions";
import axios from "@/Services/axios";
import toast from 'react-hot-toast';
import { FileText, X, Tag, Save } from "lucide-react";

export default function Edit({ id }) {
    const { can } = usePermissions();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [document, setDocument] = useState(null);

    const { data, setData, errors } = useForm({
        title: "",
        description: "",
        category_id: "",
        tags: [],
        status: "active",
    });

    useEffect(() => {
        fetchDocument();
        fetchCategories();
        fetchTags();
    }, [id]);

    const fetchDocument = async () => {
        try {
            const response = await axios.get(`/web-api/documents/${id}`);
            const doc = response.data.document;
            setDocument(doc);
            setData({
                title: doc.title || "",
                description: doc.description || "",
                category_id: doc.category_id || "",
                tags: doc.tags?.map((t) => t.id) || [],
                status: doc.status || "active",
            });
        } catch (error) {
            console.error("Erreur chargement document:", error);
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
            setAvailableTags(response.data.data || []);
        } catch (error) {
            console.error("Erreur chargement tags:", error);
        }
    };

    const handleTagToggle = (tagId) => {
        setData(
            "tags",
            data.tags.includes(tagId)
                ? data.tags.filter((id) => id !== tagId)
                : [...data.tags, tagId],
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.put(`/web-api/documents/${id}`, data);

            if (response.data.redirect) {
                window.location.href = response.data.redirect;
            }
        } catch (error) {
            console.error("Erreur mise à jour:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Erreur lors de la mise à jour");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <FloeLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </FloeLayout>
        );
    }

    return (
        <FloeLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    Modifier le document
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {document?.title}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Titre du document *
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Rapport d'activité 2024"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description du document..."
                        />
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Catégorie *
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    {/* Statut */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Statut
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Actif</option>
                            <option value="archived">Archivé</option>
                            <option value="draft">Brouillon</option>
                        </select>
                    </div>

                    {/* Tags */}
                    {availableTags.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => handleTagToggle(tag.id)}
                                        className={`px-3 py-1 rounded-full text-sm flex items-center ${
                                            data.tags.includes(tag.id)
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                        style={
                                            !data.tags.includes(tag.id)
                                                ? {
                                                      backgroundColor:
                                                          tag.color + "20",
                                                  }
                                                : {}
                                        }
                                    >
                                        <Tag size={12} className="mr-1" />
                                        {tag.name}
                                        {data.tags.includes(tag.id) && (
                                            <X size={12} className="ml-1" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Boutons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
                        <a
                            href="/documents"
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Annuler
                        </a>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                        >
                            <Save size={18} className="mr-2" />
                            {submitting ? "Mise à jour..." : "Mettre à jour"}
                        </button>
                    </div>
                </form>
            </div>
        </FloeLayout>
    );
}
