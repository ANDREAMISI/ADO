// resources/js/Pages/Users/Create.jsx
import React from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Roles/AdminLayout";
import UserForm from "./Partials/UserForm";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function Create() {
    const handleSuccess = () => {
        router.visit("/users");
    };

    return (
        <AdminLayout>
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
                            <UserPlus
                                size={28}
                                className="mr-3 text-blue-600"
                            />
                            Nouvel utilisateur
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Créez un nouveau compte utilisateur
                        </p>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <UserForm
                        onSuccess={handleSuccess}
                        onCancel={() => router.visit("/users")}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
