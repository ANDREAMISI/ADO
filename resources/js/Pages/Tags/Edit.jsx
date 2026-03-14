// resources/js/Pages/Tags/Edit.jsx
import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import ModernLayout from "@/Layouts/ModernLayout";
import axios from "@/Services/axios";
import { useToast } from "@/Hooks/useToast";
import { usePermissions } from "@/Hooks/usePermissions";
import {
    ArrowLeft,
    Save,
    X,
    Hash,
    Palette,
} from "lucide-react";

export default function Edit() {
    const { id } = usePage().props;
    const toastHook = useToast();
    const { can, isAdmin, isContributor } = usePermissions();
    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        color: "#3B82F6",
    });

    useEffect(() => {
        if (!can.editTags) {
            toastHook.error("Vous n'avez pas les permissions pour modifier les tags");
            router.visit("/tags");
            return;
        }

        fetchTag();
    }, [id]);

    const fetchTag = async () => {
        try {
            const response = await axios.get(`/web-api/tags/${id}`);
            setTag(response.data);
            setFormData({
                name: response.data.name,
                color: response.data.color,
            });
        } catch (error) {
            console.error("Erreur chargement tag:", error);
            toastHook.error("Erreur lors du chargement du tag");
            router.visit("/tags");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'color') {
            // Validate hex color
            const hexRegex = /^#[0-9A-Fa-f]{6}$/;
            if (hexRegex.test(value) || value === '') {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await axios.put(`/web-api/tags/${id}`, formData);
            toastHook.success("Tag modifié avec succès");
            router.visit("/tags");
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            toastHook.error("Erreur lors de la modification du tag");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ModernLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </ModernLayout>
        );
    }

    if (!tag) {
        return (
            <ModernLayout>
                <div className="text-center py-12">
                    <p className="text-red-600">Tag non trouvé</p>
                    <Link
                        href="/tags"
                        className="text-blue-600 hover:underline mt-4 inline-block"
                    >
                        Retour à la liste
                    </Link>
                </div>
            </ModernLayout>
        );
    }

    return (
        <ModernLayout>
            <div className="max-w-2xl mx-auto">
                {/* En-tête */}
                <div className="mb-6 flex items-center">
                    <Link
                        href="/tags"
                        className="p-2 hover:bg-gray-100 rounded-lg mr-4"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Hash size={28} className="mr-3 text-blue-600" />
                            Modifier le tag
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Modifiez les informations du tag
                        </p>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du tag <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Hash
                                    size={18}
                                    className="absolute left-3 top-3 text-gray-400"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nom du tag"
                                />
                            </div>
                        </div>

                        {/* Couleur */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Couleur
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#3B82F6"
                                />
                                <div
                                    className="w-6 h-6 rounded border border-gray-300"
                                    style={{ backgroundColor: formData.color }}
                                ></div>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => router.visit("/tags")}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
                            >
                                <X size={16} className="mr-2" />
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center"
                            >
                                <Save size={16} className="mr-2" />
                                {saving ? "Modification..." : "Modifier"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModernLayout>
    );
}
