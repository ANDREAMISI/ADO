
import { usePermissions } from '@/Hooks/usePermissions';
import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import ModernLayout from '@/Layouts/ModernLayout';
import axios from '@/Services/axios';
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
    X
} from 'lucide-react';

export default



<form onSubmit={handleSubmit} className="p-6">
                            {/* Nom */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Documents administratifs"
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Description de la catégorie..."
                                />
                            </div>

                            {/* Catégorie parente */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie parente
                                </label>
                                <select
                                    name="parent_id"
                                    value={formData.parent_id}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Aucune (catégorie racine)</option>
                                    {getAllCategories(categories)
                                        .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                                        .map(cat => (
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
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <Save size={18} className="mr-2" />
                                    {editingCategory ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
</form>
