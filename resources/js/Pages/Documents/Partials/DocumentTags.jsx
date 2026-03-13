// resources/js/Pages/Documents/Partials/DocumentTags.jsx
import React from "react";
import { Link } from "@inertiajs/react";
import { FolderTree, Tag } from "lucide-react";

export default function DocumentTags({ document }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FolderTree size={20} className="mr-2 text-green-500" />
                Catégorie et tags
            </h2>

            {/* Catégorie */}
            {document.category ? (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Catégorie</p>
                    <Link
                        href={`/categories?category=${document.category.id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <FolderTree size={16} className="mr-2" />
                        {document.category.name}
                    </Link>
                    {document.category.description && (
                        <p className="text-sm text-gray-500 mt-2">
                            {document.category.description}
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-sm text-gray-500 mb-4">Aucune catégorie</p>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 ? (
                <div>
                    <p className="text-xs text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/documents?tag=${tag.id}`}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: tag.color + "20",
                                    color: tag.color,
                                }}
                            >
                                <Tag size={14} className="mr-1" />
                                {tag.name}
                                {tag.usage_count > 0 && (
                                    <span className="ml-1 text-xs opacity-75">
                                        ({tag.usage_count})
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500">Aucun tag</p>
            )}
        </div>
    );
}
