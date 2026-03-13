import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { ArrowLeft, X, User } from "lucide-react";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout>
            <Head title="Profile" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête avec bouton fermer */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                Mon profil
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Gérez vos informations personnelles et votre mot
                                de passe
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Fermer"
                        >
                            <X
                                size={24}
                                className="text-red-600 dark:text-red-400"
                            />
                        </Link>
                    </div>

                    {/* Contenu */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
