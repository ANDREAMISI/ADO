import { usePermissions } from "@/Hooks/usePermissions";
import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import axios from "@/Services/axios";
import { useToast } from "@/Hooks/useToast";
import toast from "react-hot-toast";
import {
    FolderTree,
    Plus,
    Edit,
    Trash2,
    ChevronRight,
    ChevronDown,
    FolderOpen,
    Folder,
    Save,
    X,
} from "lucide-react";

export default function CategoriesIndex() {
    const toastHook = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [expandedIds, setExpandedIds] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent_id: "",
    });
    const { can } = usePermissions();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/web-api/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Erreur:", error);
            console.error("Erreur chargement catégories:", error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: "", description: "", parent_id: "" });
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            parent_id: category.parent_id || "",
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
            if (editingCategory) {
                await axios.put(
                    `/web-api/categories/${editingCategory.id}`,
                    formData,
                );
                toastHook.success("Catégorie modifiée avec succès");
            } else {
                await axios.post("/web-api/categories", formData);
                toastHook.success("Catégorie créée avec succès");
            }

            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            toastHook.error(
                "Erreur lors de la sauvegarde: " +
                    (error.response?.data?.message || "Erreur inconnue"),
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/web-api/categories/${id}`);
            toastHook.success("Catégorie supprimée avec succès");
            fetchCategories();
        } catch (error) {
            console.error("Erreur:", error);
            toastHook.error(
                error.response?.data?.message ||
                    "Erreur lors de la suppression",
            );
        }
    };

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const renderCategoryTree = (cats, level = 0) => {
        return cats.map((category) => (
            <React.Fragment key={category.id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                        <div
                            className="flex items-center"
                            style={{ paddingLeft: `${level * 30}px` }}
                        >
                            {category.children &&
                                category.children.length > 0 && (
                                    <button
                                        onClick={() =>
                                            toggleExpand(category.id)
                                        }
                                        className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                    >
                                        {expandedIds.includes(category.id) ? (
                                            <ChevronDown
                                                size={16}
                                                className="text-gray-500 dark:text-gray-400"
                                            />
                                        ) : (
                                            <ChevronRight
                                                size={16}
                                                className="text-gray-500 dark:text-gray-400"
                                            />
                                        )}
                                    </button>
                                )}
                            {level === 0 ? (
                                <FolderOpen
                                    size={20}
                                    className="text-yellow-500 mr-2"
                                />
                            ) : (
                                <Folder
                                    size={20}
                                    className="text-blue-500 mr-2"
                                />
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {category.name}
                            </span>
                            {!category.is_active && (
                                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                                    Inactif
                                </span>
                            )}
                        </div>
                        {category.description && level === 0 && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-8">
                                {category.description}
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {category.documents_count || 0}
                    </td>
                    <td className="px-6 py-4">
                        {can.editCategories || can.deleteCategories ? (
                            <div className="flex items-center space-x-2">
                                {can.editCategories && (
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded text-blue-600 dark:text-blue-400"
                                        title="Modifier"
                                    >
                                        <Edit size={18} />
                                    </button>
                                )}
                                {can.deleteCategories && (
                                    <button
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm">
                                Lecture seule
                            </span>
                        )}
                    </td>
                </tr>
                {expandedIds.includes(category.id) &&
                    category.children &&
                    category.children.length > 0 &&
                    renderCategoryTree(category.children, level + 1)}
            </React.Fragment>
        ));
    };

    const getAllCategories = (cats) => {
        let all = [];
        cats.forEach((cat) => {
            all.push({ id: cat.id, name: cat.name });
            if (cat.children) {
                all = [...all, ...getAllCategories(cat.children)];
            }
        });
        return all;
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

    return (
        <AppLayout>
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                            <FolderTree
                                size={32}
                                className="mr-3 text-blue-600"
                            />
                            Catégories
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gérez l'arborescence des catégories de documents
                        </p>
                    </div>
                    {can.manageCategories && (
                        <button
                            onClick={openCreateModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Nouvelle catégorie
                        </button>
                    )}
                </div>
            </div>

            {/* Liste des catégories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <FolderTree
                            size={64}
                            className="mx-auto mb-4 text-gray-300"
                        />
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Aucune catégorie
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Commencez par créer votre première catégorie
                        </p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus size={18} className="mr-2" />
                            Créer une catégorie
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Documents
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {renderCategoryTree(categories)}
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
                                {editingCategory
                                    ? "Modifier la catégorie"
                                    : "Nouvelle catégorie"}
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
                                    placeholder="Ex: Documents administratifs"
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Description de la catégorie..."
                                />
                            </div>

                            {/* Catégorie parente */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Catégorie parente
                                </label>
                                <select
                                    name="parent_id"
                                    value={formData.parent_id}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">
                                        Aucune (catégorie racine)
                                    </option>
                                    {getAllCategories(categories)
                                        .filter(
                                            (cat) =>
                                                !editingCategory ||
                                                cat.id !== editingCategory.id,
                                        )
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </select>
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
                                    {editingCategory
                                        ? "Mettre à jour"
                                        : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
