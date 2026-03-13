import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import axios from "@/Services/axios";
import { usePermissions } from "@/Hooks/usePermissions";
import { useToast } from "@/Hooks/useToast";
import {
    Tags,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Hash,
    TrendingUp,
} from "lucide-react";

export default function TagsIndex() {
    const toastHook = useToast();
    const { can, isAdmin, isContributor, user } = usePermissions();
    const [tags, setTags] = useState([]);
    const [popularTags, setPopularTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        color: "#3B82F6",
    });

    useEffect(() => {
        fetchTags();
        fetchPopularTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axios.get("/web-api/tags");
            console.log("Tags reçus:", response.data);
            setTags(response.data.data || []);
        } catch (error) {
            console.error("Erreur chargement tags:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPopularTags = async () => {
        try {
            const response = await axios.get("/web-api/tags/popular");
            console.log("Tags populaires:", response.data);
            setPopularTags(response.data.data || []);
        } catch (error) {
            console.error("Erreur tags populaires:", error);
        }
    };

    const canModifyTag = (tag) => {
        if (isAdmin) return true;
        if (isContributor) return true;
        return false;
    };

    const openCreateModal = () => {
        setEditingTag(null);
        setFormData({ name: "", color: "#3B82F6" });
        setShowModal(true);
    };

    const openEditModal = (tag) => {
        setEditingTag(tag);
        setFormData({
            name: tag.name,
            color: tag.color,
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingTag) {
                await axios.put(`/web-api/tags/${editingTag.id}`, formData);
                toastHook.success("Tag modifié avec succès");
            } else {
                await axios.post("/web-api/tags", formData);
                toastHook.success("Tag créé avec succès");
            }

            setShowModal(false);
            fetchTags();
            fetchPopularTags();
        } catch (error) {
            console.error("Erreur sauvegarde tag:", error);
            toastHook.error(
                error.response?.data?.message || "Erreur lors de la sauvegarde",
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) {
            return;
        }

        try {
            await axios.delete(`/web-api/tags/${id}`);
            toastHook.success("Tag supprimé avec succès");
            fetchTags();
            fetchPopularTags();
        } catch (error) {
            console.error("Erreur:", error);
            toastHook.error(
                error.response?.data?.message ||
                    "Erreur lors de la suppression",
            );
        }
    };

    const canCreateTags = isAdmin || isContributor;

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                            <Tags size={32} className="mr-3 text-blue-600" />
                            Tags
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gérez les tags pour organiser vos documents
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                        disabled={!canCreateTags}
                    >
                        <Plus size={20} className="mr-2" />
                        Nouveau tag
                    </button>
                </div>
            </div>

            {/* Tags populaires */}
            {popularTags.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-green-600" />
                        Tags populaires
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                            <div
                                key={tag.id}
                                className="px-3 py-1 rounded-full text-sm flex items-center"
                                style={{
                                    backgroundColor: tag.color + "20",
                                    color: tag.color,
                                }}
                            >
                                <Hash size={14} className="mr-1" />
                                {tag.name}
                                <span className="ml-2 text-xs opacity-75">
                                    ({tag.usage_count})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Liste des tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {tags.length === 0 ? (
                    <div className="text-center py-12">
                        <Tags
                            size={64}
                            className="mx-auto mb-4 text-gray-300"
                        />
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Aucun tag
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Commencez par créer votre premier tag
                        </p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={!canCreateTags}
                        >
                            <Plus size={18} className="mr-2" />
                            Créer un tag
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Tag
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Couleur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Utilisations
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {tags.map((tag) => (
                                <tr
                                    key={tag.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div
                                                className="w-6 h-6 rounded mr-3"
                                                style={{
                                                    backgroundColor: tag.color,
                                                }}
                                            ></div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {tag.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                                            {tag.color}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                            {tag.usage_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {canModifyTag(tag) ? (
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(tag)
                                                    }
                                                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded text-blue-600 dark:text-blue-400"
                                                    title="Modifier"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(tag.id)
                                                    }
                                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                Lecture seule
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal de création/édition */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                {editingTag ? "Modifier le tag" : "Nouveau tag"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <X
                                    size={20}
                                    className="text-gray-500 dark:text-gray-400"
                                />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Nom */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Important, Urgent, Archive..."
                                />
                            </div>

                            {/* Couleur */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Couleur
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="w-12 h-10 border-0 p-0 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="#RRGGBB"
                                    />
                                </div>
                            </div>

                            {/* Aperçu */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    Aperçu :
                                </p>
                                <div
                                    className="inline-flex items-center px-3 py-1 rounded-full"
                                    style={{
                                        backgroundColor: formData.color + "20",
                                        color: formData.color,
                                    }}
                                >
                                    <Hash size={14} className="mr-1" />
                                    {formData.name || "Nom du tag"}
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <Save size={18} className="mr-2" />
                                    {editingTag ? "Mettre à jour" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
