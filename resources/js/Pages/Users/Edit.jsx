// resources/js/Pages/Users/Edit.jsx
import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import ModernLayout from "@/Layouts/ModernLayout"
import UserForm from "./Partials/UserForm";
import { ArrowLeft, Edit2 } from "lucide-react";
import axios from "@/Services/axios";

export default function Edit({ id }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`/web-api/users/${id}`);
            setUser(response.data.user);
        } catch (error) {
            console.error("Erreur chargement utilisateur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        router.visit("/users");
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

    if (!user) {
        return (
            <ModernLayout>
                <div className="text-center py-12">
                    <p className="text-red-600">Utilisateur non trouvé</p>
                    <Link
                        href="/users"
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
            <div className="max-w-3xl mx-auto">
                {/* En-tête */}
                <div className="mb-6 flex items-center">
                    <Link
                        href="/users"
                        className="p-2 hover:bg-gray-100 rounded-lg mr-4"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Edit2 size={28} className="mr-3 text-yellow-600" />
                            Modifier {user.name}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Modifiez les informations de l'utilisateur
                        </p>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <UserForm
                        user={user}
                        onSuccess={handleSuccess}
                        onCancel={() => router.visit("/users")}
                    />
                </div>
            </div>
        </ModernLayout>
    );
}
